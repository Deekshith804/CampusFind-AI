import React, { useState } from 'react';
import { Item, ItemType } from '../types';
import { MapPin, Calendar, Sparkles, Loader2, ScanSearch, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  similarity?: number;
  matchReason?: string;
  hideActions?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, similarity, matchReason, hideActions = false }) => {
  const isLost = item.type === ItemType.LOST;
  const { manualMatch } = useApp();
  const [isScanning, setIsScanning] = useState(false);

  const handleAiScan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScanning(true);
    await manualMatch(item.id);
    setIsScanning(false);
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-[2rem] border border-black/[0.03] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 active:scale-[0.98]"
    >
      {/* Visual Canvas */}
      <div className="aspect-[1/1] bg-[#F9F9FB] overflow-hidden relative isolate">
        
        {/* Status Overlay */}
        <div className="absolute top-5 left-5 z-20">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur-md border border-white/40 shadow-sm ${
            isLost 
            ? 'bg-black/80 text-white' 
            : 'bg-[#2D5BFF]/80 text-white'
          }`}>
            {item.type}
          </span>
        </div>

        {similarity && (
          <div className="absolute top-5 right-5 z-20">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#0A0A0B] text-[10px] font-bold shadow-xl border border-black/5 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#2D5BFF]" />
              {Math.round(similarity)}% Probable
            </span>
          </div>
        )}

        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-200">
            <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center border border-black/5 mb-2">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Visual Record</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#0A0A0B]/0 group-hover:bg-[#0A0A0B]/5 transition-colors duration-500 pointer-events-none"></div>
      </div>

      {/* Narrative Section */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="font-bold text-[#1D1D1F] mb-3 truncate text-xl tracking-tight">
          {item.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-6">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#2D5BFF]" />
            <span className="truncate max-w-[140px]">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {matchReason ? (
           <div className="mt-auto p-5 bg-[#F9F9FB] border border-black/[0.03] rounded-2xl">
             <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#2D5BFF] uppercase tracking-widest mb-1.5">
               <Sparkles className="w-3 h-3" /> Analysis
             </div>
             <p className="text-[12px] text-[#424245] leading-relaxed italic">
               "{matchReason}"
             </p>
           </div>
        ) : (
          <div className="mt-auto flex items-end justify-between gap-4">
             <p className="text-[13px] text-[#86868B] line-clamp-2 leading-relaxed font-medium">
               {item.description || "Historical data unavailable."}
             </p>
             
             {!hideActions && (
               <button 
                 onClick={handleAiScan}
                 disabled={isScanning}
                 className="shrink-0 flex items-center gap-2 w-12 h-12 rounded-2xl bg-white border border-black/10 text-[#0A0A0B] hover:bg-[#0A0A0B] hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
                 title="Trigger Neural Match Scan"
               >
                 <div className="m-auto">
                    {isScanning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ScanSearch className="w-5 h-5" />
                    )}
                 </div>
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};