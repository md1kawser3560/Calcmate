import React from 'react';
import { Rocket, ShieldCheck, Code, Terminal, Globe, Cloud, CreditCard, ChevronRight, Copy, Check, Settings, ShieldAlert, Link as LinkIcon, RefreshCcw, Edit3, Github, Zap } from 'lucide-react';
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
      <div className="flex items-center gap-6 mb-16">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
          <Rocket size={40} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Deployment & GitHub Guide</h1>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">Live your app & Setup Auto-Updates</p>
        </div>
      </div>

      {/* GitHub & Auto-Update Section */}
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
              <h2 className="text-3xl font-black tracking-tight">{lang === 'en' ? 'Setup Auto-Update' : 'অটোমেটিক আপডেট সেটআপ'}</h2>
              <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mt-1">GitHub CI/CD Pipeline</p>
            </div>
          </div>

          <div className="space-y-12">
            <Step 
              number="G1" 
              title={lang === 'en' ? "Create Repository" : "GitHub রিপোজিটরি তৈরি"}
              desc={lang === 'en' 
                ? "Go to GitHub and create a new repository. Then run these commands in your local folder." 
                : "গিটহাবে গিয়ে একটি নতুন রিপোজিটরি তৈরি করুন এবং আপনার পিসিতে নিচের কমান্ডগুলো দিন।"}
            >
              <CommandBox command="git init" />
              <CommandBox command="git add ." />
              <CommandBox command="git commit -m 'Initial setup'" />
              <CommandBox command="git remote add origin YOUR_REPO_URL" />
              <CommandBox command="git push -u origin main" />
            </Step>

            <Step 
              number="G2" 
              title={lang === 'en' ? "Enable Auto-Deploy" : "অটো-ডিপ্লয় চালু করুন"}
              desc={lang === 'en' 
                ? "Connect your GitHub to Firebase so that site updates automatically whenever you push code." 
                : "ফায়ারবেসের সাথে গিটহাব কানেক্ট করুন যাতে কোড পুশ করলেই সাইট আপডেট হয়।"}
            >
              <CommandBox command="firebase init hosting:github" />
              <p className="text-xs text-indigo-300/60 mt-2 italic">* Follow the prompts in your terminal to authorize GitHub.</p>
            </Step>
          </div>
        </div>
      </div>

      {/* Main Deployment Steps */}
      <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-sm mb-12">
        <h2 className="text-2xl font-black mb-10 text-slate-800 flex items-center gap-3">
          <Cloud className="text-indigo-600" /> Basic Deployment
        </h2>
        <Step 
          number="01" 
          title={lang === 'en' ? "Prepare Google Cloud Account" : "গুগল ক্লাউড অ্যাকাউন্ট তৈরি"}
          desc={lang === 'en' 
            ? "Create a project in Google Cloud Console and link your billing account. Don't worry, static hosting is free." 
            : "গুগল ক্লাউড কনসোলে একটি প্রজেক্ট তৈরি করুন এবং বিলিং লিঙ্ক করুন। স্ট্যাটিক হোস্টিং এর জন্য কোনো চার্জ কাটবে না।"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-all group">
              <div className="flex items-center gap-3">
                <Cloud className="text-indigo-600" />
                <span className="font-bold text-slate-700">Google Cloud Console</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://firebase.google.com/" target="_blank" rel="noopener noreferrer" className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-all group">
              <div className="flex items-center gap-3">
                <Globe className="text-amber-500" />
                <span className="font-bold text-slate-700">Firebase Console</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </Step>

        <Step 
          number="02" 
          title={lang === 'en' ? "Install & Init" : "ইনস্টল এবং কনফিগার"}
          desc={lang === 'en' ? "Login to Firebase and setup your project hosting." : "ফায়ারবেসে লগইন করে আপনার প্রজেক্টের হোস্টিং সেটআপ করুন।"}
        >
          <CommandBox command="npm install -g firebase-tools" />
          <CommandBox command="firebase login" />
          <CommandBox command="firebase init" />
        </Step>

        <Step 
          number="03" 
          title={lang === 'en' ? "Manual Build & Deploy" : "ম্যানুয়াল বিল্ড এবং আপলোড"}
          desc={lang === 'en' ? "Final step to make your site live (if not using GitHub auto-deploy)." : "সাইটটি লাইভ করার ম্যানুয়াল কমান্ড (যদি গিটহাব অটো-ডিপ্লয় ব্যবহার না করেন)।"}
        >
          <CommandBox command="npm run build" />
          <CommandBox command="firebase deploy" />
        </Step>
      </div>

      {/* How to Update Section */}
      <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-16 text-white mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
           <RefreshCcw size={150} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Edit3 size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              {lang === 'en' ? 'How to Update Content?' : 'কিভাবে কন্টেন্ট আপডেট করবেন?'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">1</div>
                {lang === 'en' ? 'Edit & Push' : 'এডিট এবং পুশ'}
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                {lang === 'en' 
                  ? "Change your code or add a blog post in 'src/data/blogData.ts'. Then just push the code."
                  : "কোড পরিবর্তন করুন বা 'src/data/blogData.ts'-এ ব্লগ যোগ করুন। এরপর শুধু কোড পুশ করুন।"}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">2</div>
                {lang === 'en' ? 'Auto Magic' : 'অটোমেটিক আপডেট'}
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                {lang === 'en'
                  ? "GitHub Actions will catch your code, build it and deploy it to Firebase automatically!"
                  : "গিটহাব অ্যাকশন আপনার কোডটি নিয়ে নিজে নিজে বিল্ড করবে এবং ফায়ারবেসে আপলোড করে দেবে!"}
              </p>
              <div className="bg-black/20 p-4 rounded-xl space-y-2">
                 <div className="text-[10px] font-black uppercase text-indigo-300">Just run this to update:</div>
                 <div className="font-mono text-xs">$ git add .</div>
                 <div className="font-mono text-xs">$ git commit -m 'added new blog'</div>
                 <div className="font-mono text-xs">$ git push</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Launch Steps */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
               <Settings size={24} />
             </div>
             <h3 className="text-xl font-bold">Custom Domain</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Once uploaded, connect your domain (e.g. .com) for free in Firebase settings. SSL is automatic.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
               <LinkIcon size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-800">SEO & AdSense</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Submit your sitemap to Google Search Console. Ensure <code>ads.txt</code> is updated with your ID.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuide;