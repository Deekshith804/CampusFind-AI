
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemType, ItemStatus, Item } from '../types';
import { useApp } from '../context/AppContext';
import { analyzeItemImage } from '../services/geminiService';
import { Upload, Loader2, X, Image as ImageIcon, Search, Zap, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export const ReportForm: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { addItem } = useApp();
  
  const isLost = type === 'lost';
  const formType = isLost ? ItemType.LOST : ItemType.FOUND;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ tags: string[], category: string, enhancedDescription: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      setIsAnalyzing(true);
      try {
        const analysis = await analyzeItemImage(base64);
        setAiAnalysis(analysis);
      } catch (err) {
        console.error("AI Analysis error", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newItem: Item = {
      id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      type: formType,
      title: title || (aiAnalysis?.category || "Unknown Item"),
      description,
      location,
      contactName,
      contactInfo,
      imageUrl: image || undefined,
      tags: aiAnalysis?.tags || [],
      aiDescription: aiAnalysis?.enhancedDescription,
      date: new Date().toISOString(),
      status: ItemStatus.OPEN
    };

    // Small delay to feel "deliberate"
    setTimeout(() => {
      addItem(newItem);
      navigate('/browse');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto animate-reveal pb-20">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left: Branding & Status */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl ${isLost ? 'bg-[#0A0A0B] text-white' : 'bg-[#2D5BFF] text-white'}`}>
              {isLost ? <Search className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
            </div>
            <h1 className="text-5xl font-extrabold text-[#0A0A0B] tracking-[-0.04em] mb-6">
              {isLost ? 'Initiate Search' : 'Record Discovery'}
            </h1>
            <p className="text-xl text-[#86868B] leading-relaxed mb-10">
              {isLost 
                ? "Our neural engine is ready. Provide the visual and textual data, and we'll begin cross-referencing immediately." 
                : "Your discovery helps maintain the campus collective. Document the item precisely for high-accuracy matching."}
            </p>
            
            <div className="space-y-4">
              {isAnalyzing && (
                <div className="p-6 glass rounded-2xl border-[#2D5BFF]/10 flex items-center gap-4 animate-pulse-slow">
                  <div className="relative">
                    <Loader2 className="w-6 h-6 text-[#2D5BFF] animate-spin" />
                    <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-[#2D5BFF]" />
                  </div>
                  <div className="text-sm font-bold text-[#0A0A0B]">AI is analyzing visual fingerprints...</div>
                </div>
              )}

              {aiAnalysis && !isAnalyzing && (
                <div className="p-6 bg-[#F0F4FF] rounded-[2rem] border border-[#2D5BFF]/20 animate-reveal">
                  <div className="flex items-center gap-2 text-[#2D5BFF] font-bold text-[10px] uppercase tracking-widest mb-4">
                    <CheckCircle2 className="w-4 h-4" /> Neural Match Ready
                  </div>
                  <p className="text-sm font-bold text-[#0A0A0B] leading-snug mb-4">"{aiAnalysis.enhancedDescription}"</p>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/80 rounded-full text-[10px] font-bold text-[#2D5BFF] border border-[#2D5BFF]/10">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: The Form */}
        <div className="lg:w-2/3 glass p-10 lg:p-16 rounded-[3rem] shadow-2xl border-white">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Visual Record Upload */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                Visual Evidence <Sparkles className="w-3 h-3 text-[#2D5BFF]" />
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group relative h-96 w-full rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center ${
                  image 
                    ? 'border-black/5 bg-white' 
                    : 'border-dashed border-black/10 bg-[#F9F9FB] hover:bg-white hover:border-[#2D5BFF]/30'
                }`}
              >
                {image ? (
                  <>
                    <img src={image} alt="Subject Preview" className="h-full w-full object-contain p-8 animate-reveal" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                         <div className="w-full h-1 bg-black/5 absolute top-0">
                           <div className="h-full bg-[#2D5BFF] animate-[loading_2s_infinite]"></div>
                         </div>
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setImage(null); setAiAnalysis(null); }}
                      className="absolute top-8 right-8 w-12 h-12 bg-white/80 backdrop-blur rounded-full shadow-xl flex items-center justify-center text-[#0A0A0B] hover:bg-[#FF3B30] hover:text-white transition-all active:scale-90"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center group-hover:scale-105 transition-transform duration-500">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-black/5 flex items-center justify-center mx-auto mb-6">
                      <ImageIcon className="w-8 h-8 text-[#2D5BFF]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0A0B]">Drop Subject Photo</h3>
                    <p className="text-[#86868B] mt-2 text-sm">Our AI will automatically tag the item</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] px-1">What is it?</label>
                <input
                  type="text"
                  required
                  className="w-full px-8 py-5 bg-[#F9F9FB] border border-black/5 rounded-[1.25rem] focus:ring-4 focus:ring-[#2D5BFF]/5 focus:border-[#2D5BFF] outline-none transition-all font-bold text-[#0A0A0B] placeholder:text-stone-300"
                  placeholder="e.g. Blue Hydroflask 32oz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] px-1">Geo-Location</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-8 py-5 bg-[#F9F9FB] border border-black/5 rounded-[1.25rem] focus:ring-4 focus:ring-[#2D5BFF]/5 focus:border-[#2D5BFF] outline-none transition-all font-bold text-[#0A0A0B] placeholder:text-stone-300"
                    placeholder="e.g. Student Center, 2nd Floor"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] px-1">Physical Characteristics</label>
              <textarea
                rows={4}
                className="w-full px-8 py-5 bg-[#F9F9FB] border border-black/5 rounded-[1.25rem] focus:ring-4 focus:ring-[#2D5BFF]/5 focus:border-[#2D5BFF] outline-none transition-all font-bold text-[#0A0A0B] placeholder:text-stone-300 resize-none"
                placeholder="Mention unique stickers, cracks, or contents inside..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
               <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] px-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-8 py-5 bg-[#F9F9FB] border border-black/5 rounded-[1.25rem] outline-none transition-all font-bold text-[#0A0A0B]"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] px-1">Preferred Contact</label>
                <input
                  type="text"
                  required
                  className="w-full px-8 py-5 bg-[#F9F9FB] border border-black/5 rounded-[1.25rem] outline-none transition-all font-bold text-[#0A0A0B]"
                  placeholder="Email or @social"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 px-10 rounded-[1.5rem] font-extrabold text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-[0.99] flex items-center justify-center gap-4 disabled:opacity-50 ${
                  isLost ? 'bg-[#0A0A0B] text-white shadow-black/20' : 'bg-[#2D5BFF] text-white shadow-[#2D5BFF]/30 hover:bg-[#1D4ED8]'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
                {isSubmitting ? 'Syncing with Registry...' : 'Finalize & Index Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
