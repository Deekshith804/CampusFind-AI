import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe, Target } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-12 pb-24">
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="lg:w-3/5">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#2D5BFF]/5 border border-[#2D5BFF]/10 text-[#2D5BFF] text-[10px] font-bold uppercase tracking-[0.2em] mb-10 animate-reveal">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D5BFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D5BFF]"></span>
            </span>
            Real-time Monitoring Active
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.04em] text-[#0A0A0B] leading-[0.95] mb-10 animate-reveal" style={{ animationDelay: '0.1s' }}>
            Reconnect with <br/>
            what was <span className="text-[#2D5BFF]">lost.</span>
          </h1>
          
          <p className="text-xl text-[#86868B] mb-12 max-w-xl leading-relaxed animate-reveal" style={{ animationDelay: '0.2s' }}>
            The next generation of campus safety. Our neural engine scans reported items instantly, matching lost belongings to finders through visual intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 animate-reveal" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/report/lost"
              className="group flex items-center justify-center gap-4 px-10 py-5 bg-[#0A0A0B] text-white text-sm font-bold rounded-[1.25rem] hover:bg-[#1D1D1F] transition-all shadow-2xl shadow-black/20 hover:-translate-y-1 active:scale-[0.98]"
            >
              Report Missing
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/report/found"
              className="flex items-center justify-center px-10 py-5 bg-white text-[#1D1D1F] border border-black/10 text-sm font-bold rounded-[1.25rem] hover:bg-stone-50 transition-all hover:-translate-y-1"
            >
              I Found Something
            </Link>
          </div>
        </div>

        {/* Right "4K" Visual Card */}
        <div className="lg:w-2/5 w-full">
          <div className="relative group animate-float">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#2D5BFF]/20 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-all"></div>
            <div className="relative glass p-8 rounded-[3rem] border border-white shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Target className="w-6 h-6 text-[#2D5BFF]" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Confidence Score</p>
                  <p className="text-3xl font-extrabold text-[#0A0A0B]">98.4%</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2D5BFF] w-[98%] rounded-full"></div>
                </div>
                <p className="text-xs font-medium text-[#86868B]">AI processing visual hash for matches...</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Items Scanned</p>
                  <p className="text-xl font-bold">1,248</p>
                </div>
                <div className="bg-black/5 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase mb-1">Reunited</p>
                  <p className="text-xl font-bold">422</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};