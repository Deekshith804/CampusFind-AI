
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Item, AIAnalysisResult, MatchResult } from "../types";

/**
 * HELPER: Extracts clean base64 data and detects MIME type.
 */
const getBase64Data = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/jpeg', data: dataUrl }; // Fallback
};

// Initialize Gemini Client strictly following developer guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to retry operations with exponential backoff.
 * Helps with transient 500s or network blips (XHR errors).
 */
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries <= 0) throw error;
    console.warn(`Gemini API request failed, retrying in ${delay}ms...`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryOperation(operation, retries - 1, delay * 2);
  }
}

/**
 * Analyzes an image to generate tags and a description using structured JSON output.
 */
export const analyzeItemImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const imageData = base64Image.startsWith('data:') ? getBase64Data(base64Image) : { mimeType: 'image/jpeg', data: base64Image };
    
    // Using gemini-3-flash-preview for efficiency and image understanding.
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: imageData
          },
          {
            text: `Analyze this image for a lost and found system. Provide metadata in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 descriptive tags (e.g., color, material, brand)."
            },
            enhancedDescription: {
              type: Type.STRING,
              description: "A short visual summary for a blind person to identify the item."
            },
            category: {
              type: Type.STRING,
              description: "High-level category (e.g., Electronics, Personal Items)."
            }
          },
          required: ["tags", "enhancedDescription", "category"]
        }
      }
    }));

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr) as AIAnalysisResult;
    }
    throw new Error("Empty AI response");
  } catch (error) {
    console.error("Analysis Failed:", error);
    return { tags: [], enhancedDescription: "Visual analysis unavailable.", category: "Unknown" };
  }
};

/**
 * VISUAL MATCHING ENGINE
 * Optimized to handle payload limits by processing candidates in smaller batches.
 */
export const findMatches = async (targetItem: Item, candidates: Item[]): Promise<MatchResult[]> => {
  if (candidates.length === 0) return [];

  // Filter candidates to those that have visual data if target has visual data
  const filteredCandidates = candidates.filter(c => !!c.imageUrl);
  
  // 1. Candidate Prioritization
  let topCandidates: Item[] = [];
  const candidatesWithScore = filteredCandidates.map(c => {
    const intersection = c.tags.filter(t => targetItem.tags.includes(t));
    return { item: c, score: intersection.length };
  });
  
  candidatesWithScore.sort((a, b) => b.score - a.score);
  
  // CRITICAL: Limit to 1 candidate to strictly prevent 500 RPC errors due to large payload size.
  // The RPC error "code: 6" often happens when payload exceeds browser XHR limits or API limits.
  topCandidates = candidatesWithScore.slice(0, 1).map(c => c.item);

  if (topCandidates.length === 0) {
    // Fallback to text matching if no visual candidates found
    return findMatchesTextOnly(targetItem, candidates.slice(0, 5));
  }

  // 2. Prepare Multimodal Request
  const parts: any[] = [];
  
  parts.push({
    text: `Identify if any CANDIDATE_ITEM is the same physical object as the TARGET_ITEM. 
    Compare visual features like scratches, logos, color shades, and textures.`
  });

  // Target Item metadata and image.
  parts.push({ text: `\n=== TARGET_ITEM ===\nTitle: ${targetItem.title}\nDescription: ${targetItem.description}` });
  
  if (targetItem.imageUrl) {
      const targetImg = getBase64Data(targetItem.imageUrl);
      parts.push({ inlineData: targetImg });
  }

  // Candidates metadata and images.
  topCandidates.forEach((cand, idx) => {
      parts.push({ text: `\n=== CANDIDATE ${idx + 1} (ID: ${cand.id}) ===\nTitle: ${cand.title}\nDescription: ${cand.description}` });
      if (cand.imageUrl) {
          const candImg = getBase64Data(cand.imageUrl);
          parts.push({ inlineData: candImg });
      }
  });

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  confidence: { type: Type.NUMBER, description: "Confidence score 0-100" },
                  reason: { type: Type.STRING, description: "Explain the visual evidence." }
                },
                required: ["itemId", "confidence", "reason"]
              }
            }
          },
          required: ["matches"]
        }
      }
    }));

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      const data = JSON.parse(jsonStr);
      return (data.matches || []).filter((m: MatchResult) => m.confidence > 60);
    }
    return [];
  } catch (error: any) {
    // If we hit a payload error, try a text-only fallback for at least some basic matching
    console.warn("Visual match failed (likely payload size), falling back to text analysis:", error);
    // Use the original candidates list for text fallback, limited to 5
    return findMatchesTextOnly(targetItem, candidates.slice(0, 5));
  }
};

/**
 * Text-only fallback to ensure system remains functional when images are too large.
 */
async function findMatchesTextOnly(targetItem: Item, candidates: Item[]): Promise<MatchResult[]> {
  try {
    const prompt = `Compare this target item against candidates based on text descriptions.
    Target: ${targetItem.title} - ${targetItem.description}
    Candidates: ${candidates.map(c => `[ID: ${c.id}] ${c.title} - ${c.description}`).join('\n')}`;

    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] }, // Explicit content structure
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  itemId: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                },
                required: ["itemId", "confidence", "reason"]
              }
            }
          },
          required: ["matches"]
        }
      }
    }));

    const jsonStr = response.text?.trim();
    return jsonStr ? (JSON.parse(jsonStr).matches || []) : [];
  } catch (e) {
    console.error("Text-only matching also failed:", e);
    return [];
  }
}
