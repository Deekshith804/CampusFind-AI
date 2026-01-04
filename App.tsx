import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ReportForm } from './components/ReportForm';
import { BrowseItems } from './components/BrowseItems';
import { ScanLine, ShieldCheck, BellRing, Target, Activity, Cpu } from 'lucide-react';

const SystemFeature: React.FC<{ icon: any, title: string, desc: string, delay: string }> = ({ icon: Icon, title, desc, delay }) => (
  <div className="flex flex-col items-start p-8 glass rounded-[2.5rem] border-white shadow-sm hover:shadow-xl transition-all animate-reveal group" style={{ animationDelay: delay }}>
    <div className="p-4 bg-white rounded-2xl text-[#2D5BFF] shadow-sm mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-2xl font-bold text-[#0A0A0B] tracking-tight mb-2">{title}</h3>
    <p className="text-[#86868B] text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="pb-24">
      <Hero />
      
      <div className="mt-40">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
           <div>
              <div className="text-[#2D5BFF] font-bold text-xs uppercase tracking-[0.3em] mb-4">The Engine</div>
              <h2 className="text-5xl font-extrabold tracking-[-0.03em] text-[#0A0A0B]">Advanced Neural <br/>Matching Infrastructure</h2>
           </div>
           <div className="max-w-md text-[#86868B] text-lg font-medium">
              We've built a multi-modal search architecture that understands object context, location proximity, and visual similarity.
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <SystemFeature 
            icon={Target} 
            title="Vision Recognition" 
            desc="Gemini-powered analysis extracts visual fingerprints from every image, enabling high-precision re-identification."
            delay="0.1s"
          />
          <SystemFeature 
            icon={Cpu} 
            title="Real-time Scans" 
            desc="The matching engine continuously monitors new reports, cross-referencing lost and found logs in milliseconds."
            delay="0.2s"
          />
          <SystemFeature 
            icon={Activity} 
            title="Neural Alerts" 
            desc="Automated notifications are triggered only when a high-confidence match is verified by our visual algorithm."
            delay="0.3s"
          />
        </div>
      </div>
      
      {/* 4K Tech Banner */}
      <div className="mt-40 glass rounded-[3rem] p-12 lg:p-20 relative overflow-hidden border-white shadow-2xl">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12">
          <ScanLine className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0A0A0B] tracking-tighter mb-8 leading-tight">Privacy-First Intelligent Discovery.</h2>
            <p className="text-xl text-[#86868B] font-medium leading-relaxed">
              We encrypt all contact data and use abstract visual hashes to protect user privacy while maintaining the highest reunification rates on campus.
            </p>
          </div>
          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-6">
             <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="text-4xl font-extrabold text-[#0A0A0B] mb-1">0.8s</div>
                <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Avg. Match Time</div>
             </div>
             <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="text-4xl font-extrabold text-[#2D5BFF] mb-1">99.9%</div>
                <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">System Uptime</div>
             </div>
             <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="text-4xl font-extrabold text-[#0A0A0B] mb-1">2k+</div>
                <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Secure Channels</div>
             </div>
             <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="text-4xl font-extrabold text-[#2D5BFF] mb-1">AES</div>
                <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">End-to-End Encrypted</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report/:type" element={<ReportForm />} />
            <Route path="/browse" element={<BrowseItems />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;