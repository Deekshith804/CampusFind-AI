import { GoogleGenAI, Type } from "@google/genai";
import { Item, AIAnalysisResult, MatchResult } from "../types";

const getBase64Data = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: 'image/jpeg', data: dataUrl };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an image for automated tagging and description.
 */
export const analyzeItemImage = async (base64Image: string): Promise<AIAnalysisResult> => {
  try {
    const imageData = base64Image.startsWith('data:') ? getBase64Data(base64Image) : { mimeType: 'image/jpeg', data: base64Image };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: imageData },
          { text: "Analyze this lost/found item. Return a JSON object with 'tags' (array of 5 descriptive strings), 'enhancedDescription' (a detailed 1-sentence physical summary), and 'category' (broad category like Electronics, Clothing, etc.)." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            enhancedDescription: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["tags", "enhancedDescription", "category"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AIAnalysisResult;
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return { tags: ["Item"], enhancedDescription: "Registry entry created.", category: "General" };
  }
};

/**
 * Advanced Matching Engine using Gemini 3 Pro reasoning.
 */
export const findMatches = async (targetItem: Item, candidates: Item[]): Promise<MatchResult[]> => {
  if (candidates.length === 0) return [];

  const topCandidates = candidates
    .map(c => ({
      item: c,
      score: c.tags.filter(t => targetItem.tags.includes(t)).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(c => c.item);

  if (topCandidates.length === 0) return [];

  const parts: any[] = [
    { text: "Act as a forensic visual matching expert. Compare the TARGET_ITEM with the CANDIDATES. Determine if they are the SAME physical object based on visual cues, wear and tear, and specific descriptions." },
    { text: `\nTARGET_ITEM:\nTitle: ${targetItem.title}\nDescription: ${targetItem.description}` }
  ];

  if (targetItem.imageUrl) {
    parts.push({ inlineData: getBase64Data(targetItem.imageUrl) });
  }

  topCandidates.forEach((cand, i) => {
    parts.push({ text: `\nCANDIDATE_${i} (ID: ${cand.id}):\nTitle: ${cand.title}\nDescription: ${cand.description}` });
    if (cand.imageUrl) {
      parts.push({ inlineData: getBase64Data(cand.imageUrl) });
    }
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
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
    });

    const data = JSON.parse(response.text || '{"matches":[]}');
    return data.matches.filter((m: any) => m.confidence > 75);
  } catch (error) {
    console.warn("Visual match failed:", error);
    return [];
  }
};