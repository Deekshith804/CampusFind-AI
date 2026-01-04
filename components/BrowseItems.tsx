
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from './ItemCard';
import { Item, ItemType } from '../types';
// Added missing Zap to the lucide-react import
import { Search, Filter, X, MapPin, Calendar, User, Phone, Sparkles, Zap } from 'lucide-react';

export const BrowseItems: React.FC = () => {
  const { items } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | ItemType>('ALL');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeFilter !== 'ALL' && item.type !== activeFilter) return false;
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.location.toLowerCase().includes(term)
      );
    });
  }, [items, searchTerm, activeFilter]);

  return (
    <div className="space-y-16 animate-reveal">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <div className="flex items-center gap-2 text-[#2D5BFF] font-bold text-xs uppercase tracking-[0.2em] mb-3">
             <Filter className="w-4 h-4" /> Global Archive
          </div>
          <h1 className="text-5xl font-extrabold text-[#0A0A0B] tracking-[-0.03em]">Recorded Items</h1>
          <p className="text-[#86868B] mt-3 text-xl max-w-lg">Access the university-wide neural database of lost and found belongings.</p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-5">
          <div className="relative flex-grow lg:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B] group-focus-within:text-[#2D5BFF] transition-colors" />
            <input
              type="text"
              placeholder="Search via keyword, color, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-[1.25rem] text-sm font-bold focus:ring-2 focus:ring-[#2D5BFF]/10 focus:border-[#2D5BFF] outline-none transition-all placeholder:text-stone-300 text-[#0A0A0B] shadow-sm"
            />
          </div>
          
          <div className="flex glass p-1.5 rounded-[1.25rem] shadow-sm border border-black/5">
             {['ALL', ItemType.LOST, ItemType.FOUND].map((type) => (
               <button
                key={type}
                onClick={() => setActiveFilter(type as any)}
                className={`px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all ${
                  activeFilter === type 
                  ? 'bg-[#0A0A0B] text-white shadow-xl' 
                  : 'text-[#86868B] hover:text-[#0A0A0B] hover:bg-black/5'
                }`}
              >
                {type}
              </button>
             ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-40 bg-white border border-dashed border-black/10 rounded-[3rem]">
          <div className="w-24 h-24 bg-[#F9F9FB] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <Search className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="text-2xl font-bold text-[#0A0A0B] tracking-tight">No match in database</h3>
          <p className="text-[#86868B] mt-3 text-lg max-w-md mx-auto">
            Our search was unable to find reports matching your current parameters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      {/* High-Impact Detail View */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A0A0B]/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-reveal">
            
            <div className="relative h-[400px] bg-[#F9F9FB] flex-shrink-0">
               {selectedItem.imageUrl ? (
                 <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-20 h-20 text-stone-100" />
                 </div>
               )}
               <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-8 right-8 w-14 h-14 glass flex items-center justify-center text-[#0A0A0B] rounded-full transition-all hover:bg-white hover:scale-110 active:scale-95 shadow-xl"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="p-12 overflow-y-auto">
              <div className="flex justify-between items-start mb-10">
                 <div>
                   <div className="flex items-center gap-3 mb-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] ${
                        selectedItem.type === ItemType.LOST 
                        ? 'bg-black text-white' 
                        : 'bg-[#2D5BFF] text-white'
                      }`}>
                        {selectedItem.type}
                      </span>
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Archive ID: {selectedItem.id.slice(0,8)}</span>
                   </div>
                   <h2 className="text-5xl font-extrabold text-[#0A0A0B] tracking-[-0.04em]">{selectedItem.title}</h2>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.1em]">Detection Zone</p>
                    <div className="flex items-center gap-2 font-bold text-[#0A0A0B]">
                       <MapPin className="w-4 h-4 text-[#2D5BFF]" />
                       {selectedItem.location}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.1em]">Timestamp</p>
                    <div className="flex items-center gap-2 font-bold text-[#0A0A0B]">
                       <Calendar className="w-4 h-4 text-[#2D5BFF]" />
                       {new Date(selectedItem.date).toLocaleDateString()}
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.1em]">Status</p>
                    <div className="flex items-center gap-2 font-bold text-emerald-600">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       Active Report
                    </div>
                 </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-4">Subject Narrative</h3>
                  <p className="text-[#424245] leading-relaxed text-2xl font-medium tracking-tight">
                    {selectedItem.description || "No specific details provided for this archive entry."}
                  </p>
                </div>

                {selectedItem.aiDescription && (
                   <div className="p-8 glass rounded-[2rem] border border-[#2D5BFF]/10 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="w-24 h-24" />
                      </div>
                      <h3 className="text-[10px] font-bold text-[#2D5BFF] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        Neural Image Analysis
                      </h3>
                      <p className="text-[#0A0A0B] text-lg font-bold leading-snug">
                        {selectedItem.aiDescription}
                      </p>
                   </div>
                )}

                <div>
                   <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-6">Subject Contact Data</h3>
                   <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 bg-[#F9F9FB] rounded-[1.5rem] p-6 flex items-center gap-5 border border-black/5">
                         <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2D5BFF]">
                           <User className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Reporter Name</p>
                           <p className="text-lg font-bold text-[#0A0A0B]">{selectedItem.contactName}</p>
                         </div>
                      </div>
                      <div className="flex-1 bg-[#F9F9FB] rounded-[1.5rem] p-6 flex items-center gap-5 border border-black/5">
                         <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2D5BFF]">
                           <Phone className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Encrypted Link</p>
                           <p className="text-lg font-bold text-[#0A0A0B]">{selectedItem.contactInfo}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-black/5 bg-[#F9F9FB] flex justify-end">
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-12 py-5 bg-[#0A0A0B] hover:bg-[#1D1D1F] text-white font-bold rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                Close Archive
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
