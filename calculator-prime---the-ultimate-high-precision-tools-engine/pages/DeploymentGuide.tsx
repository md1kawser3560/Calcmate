
import React from 'react';
import { Rocket, ShieldCheck, Code, Terminal, Globe, Cloud, CreditCard, ChevronRight, Copy, Check, Settings, ShieldAlert, Link as LinkIcon, RefreshCcw, Edit3, Github, Zap, AlertCircle, Info, ListChecks, MousePointer2, Command, HelpCircle } from 'lucide-react';
import { useLanguage } from '../App';

const CommandBox = ({ command }: { command: string }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group bg-slate-900 rounded-xl p-5 mb-4 font-mono text-sm text-indigo-300 flex items-center justify-between border border-white/5">
      <span className="truncate pr-8">$ {command}</span>
      <button 
        onClick={handleCopy}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 group-hover:text-white"
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
      </button>
    </div>
  );
};

const Step = ({ number, title, desc, children }: { number: string, title: string, desc: string, children?: React.ReactNode }) => (
  <div className="relative pl-16 pb-16 last:pb-0">
    <div className="absolute left-0 top-0 w-12 h-12 bg-white rounded-2xl shadow-lg shadow-indigo-500/10 flex items-center justify-center font-black text-indigo-600 border border-indigo-50 text-xl">
      {number}
    </div>
    <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-indigo-100 to-transparent"></div>
    
    <div className="space-y-3">
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{desc}</p>
      <div className="pt-4">{children}</div>
    </div>
  </div>
);

const DeploymentGuide = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-6 mb-16 px-2">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
          <Rocket size={40} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Deployment & GitHub Guide</h1>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">Live your app & Setup Auto-Updates</p>
        </div>
      </div>

      {/* ERROR FIX SECTION - NEW ADDITION */}
      <div className="bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] p-10 mb-16 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
            <HelpCircle size={120} className="text-amber-600" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-amber-600 text-white rounded-2xl">
                  <ShieldAlert size={28} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-amber-900 tracking-tight">"Localhost Refused to Connect"?</h2>
                  <p className="text-amber-600 font-bold text-xs uppercase tracking-widest">Fix for cloud terminal users</p>
               </div>
            </div>
            <p className="text-amber-800/80 font-medium mb-8 leading-relaxed">
               If your browser shows this error after Google Login, don't worry! This is normal when using a remote server.
            </p>
            
            <div className="bg-white/60 p-6 rounded-2xl border border-amber-200 space-y-4">
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center font-black shrink-0">1</div>
                  <p className="text-sm text-amber-900 font-bold">Look at the browser URL bar. Copy the code after <span className="text-rose-600">code=</span> and before the <span className="text-rose-600">&</span> symbol.</p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center font-black shrink-0">2</div>
                  <p className="text-sm text-amber-900 font-bold">Paste that code into your terminal and press <b>Enter</b>.</p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center font-black shrink-0">3</div>
                  <p className="text-sm text-amber-900 font-bold">If you can't find it, stop with <b>Ctrl+C</b> and use: <br/><code className="bg-slate-800 text-white px-2 py-1 rounded mt-2 block">firebase login --no-localhost</code></p>
               </div>
            </div>
         </div>
      </div>

      {/* TERMINAL CHEAT SHEET */}
      <div className="bg-slate-900 rounded-[3rem] p-10 mb-16 text-white relative overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <Command size={150} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                  <Terminal size={28} />
               </div>
               <div>
                  <h2 className="text-2xl font-black tracking-tight">Firebase Init Guide</h2>
                  <p className="text-indigo-300 font-bold text-xs uppercase tracking-widest">Select the correct option below</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="p-6 bg-emerald-900/40 border-2 border-emerald-500/30 rounded-3xl animate-pulse">
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-2">Step: Which feature to select?</p>
                  <p className="text-lg font-black text-white">(*) Hosting: Set up deployments for static web apps</p>
                  <p className="text-[10px] text-emerald-300/60 mt-2">Use Arrows to go down, <b>Spacebar</b> to mark (*), then <b>Enter</b>.</p>
               </div>

               {[
                 { q: "What do you want to use as your public directory?", a: "dist", note: "Type 'dist' and press Enter" },
                 { q: "Configure as a single-page app?", a: "Yes", note: "Press 'y' then Enter" },
                 { q: "Set up automatic builds with GitHub?", a: "Yes", note: "Allows site auto-updates" },
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="flex-1">
                       <p className="text-indigo-400 text-[10px] font-black uppercase tracking-wider mb-1">Question</p>
                       <p className="text-sm font-medium italic text-slate-300">"{item.q}"</p>
                    </div>
                    <div className="md:text-right">
                       <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wider mb-1">Your Answer</p>
                       <p className="text-lg font-black text-white">{item.a}</p>
                       <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{item.note}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Full Deployment Flow */}
      <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-sm mb-12">
        <h2 className="text-2xl font-black mb-10 text-slate-800 flex items-center gap-3">
          <ListChecks className="text-indigo-600" /> Deployment Commands
        </h2>
        
        <Step 
          number="01" 
          title="Manual Build"
          desc="Create the final files for your website."
        >
          <CommandBox command="npm run build" />
        </Step>

        <Step 
          number="02" 
          title="Manual Deploy"
          desc="Push your code to the live server instantly."
        >
          <CommandBox command="firebase deploy" />
        </Step>
      </div>

      {/* GitHub Section */}
      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-white mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
           <Github size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
              <Zap size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">{lang === 'en' ? 'Auto-Update Setup' : 'অটো-আপডেট সেটআপ'}</h2>
              <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mt-1">Continuous Integration via GitHub</p>
            </div>
          </div>

          <div className="space-y-12">
            <Step 
              number="G1" 
              title="GitHub Connection"
              desc="This connects your code repository to Firebase Hosting."
            >
              <CommandBox command="firebase init hosting:github" />
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mt-6 text-sm text-slate-400 space-y-3">
                 <p>• It will ask for your repo: <b>username/repo-name</b></p>
                 <p>• Set up build script: <b>npm ci && npm run build</b></p>
                 <p>• Set up deploy on merge: <b>Yes</b></p>
              </div>
            </Step>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuide;
