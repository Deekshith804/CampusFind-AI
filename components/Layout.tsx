import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Bell, Sparkles, X, User, Zap, Phone, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notification, Item, ItemType } from '../types';
import { ItemCard } from './ItemCard';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { 
    notifications, 
    dismissNotification, 
    items, 
    activeModalNotification, 
    setActiveModalNotification 
  } = useApp();

  const [detailedItem, setDetailedItem] = useState<Item | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path 
      ? "text-[#0A0A0B] font-bold" 
      : "text-[#86868B] hover:text-[#1D1D1F] transition-all";
  }

  const handleNotificationClick = (notification: Notification) => {
    setActiveModalNotification(notification);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* High-End Glass Header */}
      <header className="fixed w-full top-0 z-[60] py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass h-16 rounded-[1.25rem] px-6 flex items-center justify-between shadow-sm">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#0A0A0B] rounded-lg flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight">CampusFind<span className="text-[#2D5BFF]">AI</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-widest">
              <Link to="/" className={isActive('/')}>Vision</Link>
              <Link to="/browse" className={isActive('/browse')}>Archive</Link>
              <Link to="/report/lost" className={isActive('/report/lost')}>Report Lost</Link>
              <Link to="/report/found" className={isActive('/report/found')}>Report Found</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative p-2.5 text-[#86868B] hover:text-[#1D1D1F] bg-white/50 rounded-full transition-all border border-black/5">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#2D5BFF] rounded-full border-2 border-white"></span>
                )}
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-stone-200 to-stone-50 border border-black/5 flex items-center justify-center cursor-pointer hover:shadow-md transition-all">
                <User className="w-4 h-4 text-stone-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Dynamic Island Notifications */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-3 w-full max-w-md pointer-events-none px-4">
        {notifications.map(notif => (
          <div 
            key={notif.id}
            className="pointer-events-auto glass rounded-3xl shadow-2xl p-4 px-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all group animate-reveal border border-white/40"
            onClick={() => handleNotificationClick(notif)}
          >
            <div className="w-10 h-10 bg-[#2D5BFF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#2D5BFF]/20 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-grow">
              <p className="text-[10px] font-bold text-[#2D5BFF] uppercase tracking-widest mb-1">New Match Alert</p>
              <p className="text-[12px] font-semibold text-[#1D1D1F] leading-snug">{notif.message}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
              className="p-1 text-stone-300 hover:text-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          {children}
        </div>
      </main>

      <footer className="py-12 border-t border-black/[0.03] bg-white/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2D5BFF]" />
            <span className="font-bold text-sm tracking-tight text-[#86868B]">CampusFind Intelligence Hub</span>
          </div>
          <p className="text-[#86868B] text-xs font-medium uppercase tracking-widest">© {new Date().getFullYear()} Modern Systems Corp.</p>
        </div>
      </footer>

      {/* Cinematic Modal (Match Results) */}
      {activeModalNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0A0A0B]/20 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-black/5 animate-reveal">
            <div className="p-10 border-b border-black/5 flex justify-between items-end bg-[#F9F9FB]">
              <div>
                <div className="flex items-center gap-2 text-[#2D5BFF] font-bold text-xs uppercase tracking-[0.2em] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Neural Match Discovery
                </div>
                <h3 className="text-4xl font-bold text-[#1D1D1F] tracking-tighter">Matches Found for "{activeModalNotification.targetItemTitle}"</h3>
              </div>
              <button 
                onClick={() => setActiveModalNotification(null)} 
                className="w-12 h-12 bg-white border border-black/5 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-10 overflow-y-auto bg-white flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeModalNotification.matches.map(match => {
                  const item = items.find(i => i.id === match.itemId);
                  if (!item) return null;
                  return (
                    <ItemCard 
                      key={item.id} 
                      item={item} 
                      similarity={match.confidence}
                      matchReason={match.reason}
                      hideActions
                      onClick={() => setDetailedItem(item)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="p-8 border-t border-black/5 bg-[#F9F9FB] flex justify-end gap-4">
              <button 
                onClick={() => {
                  dismissNotification(activeModalNotification.id);
                  setActiveModalNotification(null);
                }}
                className="px-8 py-4 rounded-2xl text-[#86868B] font-bold text-xs uppercase tracking-widest hover:bg-black/5 transition-colors"
              >
                Dismiss Notifications
              </button>
              <button 
                onClick={() => setActiveModalNotification(null)}
                className="px-10 py-4 rounded-2xl bg-[#0A0A0B] text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drilling Down into Item Details from Match Results */}
      {detailedItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#0A0A0B]/40 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-reveal">
            
            <div className="relative h-[420px] bg-[#F9F9FB] flex-shrink-0">
               {detailedItem.imageUrl ? (
                 <img src={detailedItem.imageUrl} alt={detailedItem.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-24 h-24 text-stone-100" />
                 </div>
               )}
               <button 
                onClick={() => setDetailedItem(null)}
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
                        detailedItem.type === ItemType.LOST 
                        ? 'bg-black text-white' 
                        : 'bg-[#2D5BFF] text-white'
                      }`}>
                        {detailedItem.type}
                      </span>
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Digital Registry ID: {detailedItem.id.slice(0,8)}</span>
                   </div>
                   <h2 className="text-5xl font-extrabold text-[#0A0A0B] tracking-[-0.04em]">{detailedItem.title}</h2>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-10 mb-12 pb-10 border-b border-black/5">
                 <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Detection Zone</p>
                    <div className="flex items-center gap-3 font-bold text-xl text-[#0A0A0B]">
                       <MapPin className="w-5 h-5 text-[#2D5BFF]" />
                       {detailedItem.location}
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Registry Date</p>
                    <div className="flex items-center gap-3 font-bold text-xl text-[#0A0A0B]">
                       <Calendar className="w-5 h-5 text-[#2D5BFF]" />
                       {new Date(detailedItem.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </div>
                 </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-4">Subject Narrative</h3>
                  <p className="text-[#424245] leading-relaxed text-2xl font-medium tracking-tight">
                    {detailedItem.description || "No specific narrative provided for this registry entry."}
                  </p>
                </div>

                <div>
                   <h3 className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-8">
                     {detailedItem.type === ItemType.FOUND ? 'Finder Information & Details' : 'Owner Retrieval Information'}
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="bg-[#F9F9FB] rounded-[2rem] p-8 flex items-center gap-6 border border-black/5">
                         <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2D5BFF]">
                           <User className="w-8 h-8" />
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1 tracking-wider">
                             {detailedItem.type === ItemType.FOUND ? 'Finder Name' : 'Owner Name'}
                           </p>
                           <p className="text-xl font-bold text-[#0A0A0B]">{detailedItem.contactName}</p>
                         </div>
                      </div>
                      <div className="bg-[#F9F9FB] rounded-[2rem] p-8 flex items-center gap-6 border border-black/5">
                         <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2D5BFF]">
                           <Phone className="w-8 h-8" />
                         </div>
                         <div>
                           <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1 tracking-wider">Contact Detail</p>
                           <p className="text-xl font-bold text-[#0A0A0B]">{detailedItem.contactInfo}</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-black/5 bg-[#F9F9FB] flex justify-end">
              <button 
                onClick={() => setDetailedItem(null)}
                className="px-14 py-5 bg-[#0A0A0B] hover:bg-[#1D1D1F] text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                Close Discovery View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};