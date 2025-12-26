
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Ruler, Activity, Grid3x3, Star, Link as LinkIcon, 
  Coins, PiggyBank, ArrowRight, Search, Zap, Sparkles, LayoutGrid, Globe, 
  ShieldCheck, Heart, Share2, Percent, Binary, ReceiptText, DollarSign, 
  Landmark, Baby, QrCode, Clock, Calendar, MapPin, ShieldCheck as ShieldIcon, 
  AlignLeft, Type, Hash, Tag, FileText
} from 'lucide-react';
import { useLanguage } from '../App';

const FeaturedCard = ({ to, icon: Icon, title, desc, color, isNew }: { to: string, icon: any, title: string, desc: string, color: string, isNew?: boolean }) => {
  return (
    <Link to={to} className="group relative bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} transition-opacity duration-500`}></div>
      <div className="absolute top-0 right-0 p-6">
        {isNew && (
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
            <Zap size={12} fill="currentColor" /> NEW
          </div>
        )}
      </div>
      <div className="flex justify-between items-start mb-10">
        <div className={`w-20 h-20 ${color} bg-opacity-10 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
          <Icon size={40} className={color.replace('bg-', 'text-')} />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-6 group-hover:translate-x-0">
          <ArrowRight size={24} className="text-slate-400" />
        </div>
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors tracking-tight">{title}</h3>
      <p className="text-slate-500 text-lg leading-relaxed mb-8 flex-1 font-medium">{desc}</p>
      <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
         <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-indigo-600 transition-colors">Launch Tool</span>
         <div className={`h-1.5 w-12 rounded-full ${color} opacity-20 group-hover:opacity-100 transition-all`}></div>
      </div>
    </Link>
  );
};

const CategoryIconBox = ({ onClick, icon: Icon, title, color, count, active }: { onClick: () => void, icon: any, title: string, color: string, count: string, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] border transition-all group flex flex-col items-center text-center w-full ${
      active 
        ? `bg-white border-indigo-400 shadow-xl shadow-indigo-100 ring-2 ring-indigo-50` 
        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5'
    }`}
  >
    <div className={`w-16 h-16 ${color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
      <Icon size={28} className={color.replace('bg-', 'text-')} />
    </div>
    <span className="font-black text-slate-800 text-sm uppercase tracking-wider mb-1">{title}</span>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count}</span>
  </button>
);

const HomePage = () => {
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const toolsSectionRef = useRef<HTMLDivElement>(null);

  const allTools = [
    { id: 'perc', name: t('percent_calc'), icon: Percent, path: '/percentage-calculator', cat: 'math' },
    { id: 'gen', name: t('gen_calc'), icon: Grid3x3, path: '/general-calculator', cat: 'math' },
    { id: 'unit', name: t('unit_conv'), icon: Ruler, path: '/unit-converter', cat: 'math' },
    { id: 'numsys', name: t('num_sys'), icon: Binary, path: '/number-system', cat: 'math' },
    
    { id: 'gold', name: t('gold_calc'), icon: Coins, path: '/gold-calculator', cat: 'finance' },
    { id: 'disc', name: t('discount_calc'), icon: Tag, path: '/discount-calculator', cat: 'finance' },
    { id: 'sanchay', name: t('sanchay_calc'), icon: PiggyBank, path: '/sanchaypatra-calculator', cat: 'finance' },
    { id: 'emi', name: t('emi_calc'), icon: Calculator, path: '/emi-calculator', cat: 'finance' },
    { id: 'mort', name: t('mortgage_calc'), icon: Landmark, path: '/mortgage-calculator', cat: 'finance' },
    { id: 'tax', name: t('tax_calc'), icon: Percent, path: '/tax-calculator', cat: 'finance' },
    { id: 'curr', name: t('currency_calc'), icon: DollarSign, path: '/currency-converter', cat: 'finance' },
    
    { id: 'age', name: t('age_calc'), icon: Baby, path: '/age-calculator', cat: 'health' },
    { id: 'bmi', name: t('bmi_calc'), icon: Activity, path: '/bmi-calculator', cat: 'health' },
    
    { id: 'invoice', name: t('invoice_maker'), icon: ReceiptText, path: '/invoice-maker', cat: 'digital' },
    { id: 'url', name: t('url_short'), icon: LinkIcon, path: '/url-shortener', cat: 'digital' },
    { id: 'qr', name: t('qr_gen'), icon: QrCode, path: '/qr-generator', cat: 'digital' },
    { id: 'time', name: t('time_zone'), icon: Clock, path: '/time-zone', cat: 'digital' },
    { id: 'cal', name: t('calendar'), icon: Calendar, path: '/calendar', cat: 'digital' },
    { id: 'ip', name: t('ip_loc'), icon: MapPin, path: '/ip-location', cat: 'digital' },
    { id: 'pass', name: t('password_gen'), icon: ShieldIcon, path: '/password-generator', cat: 'digital' },
    { id: 'word', name: t('word_count'), icon: AlignLeft, path: '/word-counter', cat: 'digital' },
    { id: 'n2w', name: t('num_words'), icon: Type, path: '/number-to-words', cat: 'digital' },
  ];

  const filteredTools = activeFilter 
    ? allTools.filter(tool => tool.cat === activeFilter)
    : [];

  const handleCategoryClick = (category: string) => {
    setActiveFilter(category);
    setTimeout(() => {
      toolsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CalcMate - Smart Online Tools',
        text: 'Check out these amazing free online tools and calculators!',
        url: window.location.origin,
      });
    }
  };

  const getCategoryTitle = () => {
    if (!activeFilter) return '';
    const titles: Record<string, string> = {
        math: lang === 'en' ? 'MATHEMATICAL TOOLS' : 'গণিত বিষয়ক টুলস',
        finance: lang === 'en' ? 'FINANCIAL CALCULATORS' : 'আর্থিক হিসাবের টুলস',
        health: lang === 'en' ? 'HEALTH & LIFE TOOLS' : 'স্বাস্থ্য ও জীবন বিষয়ক টুলস',
        digital: lang === 'en' ? 'DIGITAL UTILITIES' : 'ডিজিটাল ইউটিলিটি টুলস'
    };
    return titles[activeFilter];
  };

  return (
    <div className="space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative py-24 text-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-100 text-slate-500 text-[11px] font-black shadow-sm uppercase tracking-[0.2em]">
            <Star size={14} className="text-amber-500" fill="currentColor" /> Premium Digital Toolkit
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter">
            {t('hero_title')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 drop-shadow-sm">{t('hero_highlight')}</span>
          </h1>
          <div className="max-w-2xl mx-auto relative group">
             <div className="relative flex items-center bg-white border border-slate-200 rounded-[2.5rem] p-2 shadow-2xl shadow-indigo-100/30 ring-1 ring-black/5">
                <div className="p-4 text-slate-400"><Search size={24} /></div>
                <input 
                  type="text" 
                  placeholder={t('search_placeholder')}
                  className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 text-lg placeholder:text-slate-300"
                  onFocus={() => {
                    const drawerBtn = document.querySelector('button[class*="bg-slate-900"]') as HTMLButtonElement;
                    drawerBtn?.click();
                  }}
                />
             </div>
          </div>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium opacity-80">
            {t('hero_desc')}
          </p>
          
          <div className="flex justify-center">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl shadow-slate-100/50"
            >
              <Share2 size={18} className="text-indigo-600" /> Share with Friends
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section>
        <div className="flex flex-col items-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight text-center uppercase tracking-widest">{t('featured')}</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <FeaturedCard to="/gold-calculator" icon={Coins} title={t('gold_calc')} desc={t('desc_gold')} color="bg-amber-500" isNew={true} />
          <FeaturedCard to="/emi-calculator" icon={Calculator} title={t('emi_calc')} desc={t('desc_emi')} color="bg-blue-600" />
          <FeaturedCard to="/sanchaypatra-calculator" icon={PiggyBank} title={t('sanchay_calc')} desc={t('desc_sanchay')} color="bg-emerald-600" isNew={true} />
        </div>
      </section>

      {/* Category Section */}
      <section className="bg-slate-50/50 rounded-[4rem] p-12 md:p-24 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase tracking-[0.2em]">{t('categories')}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
             <CategoryIconBox 
               onClick={() => handleCategoryClick('math')} 
               icon={Grid3x3} 
               title={lang === 'en' ? 'MATH' : 'গণিত'} 
               color="bg-sky-500" 
               count="4+ TOOLS" 
               active={activeFilter === 'math'}
             />
             <CategoryIconBox 
               onClick={() => handleCategoryClick('finance')} 
               icon={Coins} 
               title={lang === 'en' ? 'FINANCE' : 'আর্থিক'} 
               color="bg-amber-500" 
               count="7+ TOOLS" 
               active={activeFilter === 'finance'}
             />
             <CategoryIconBox 
               onClick={() => handleCategoryClick('health')} 
               icon={Activity} 
               title={lang === 'en' ? 'HEALTH' : 'স্বাস্থ্য'} 
               color="bg-rose-500" 
               count="2+ TOOLS" 
               active={activeFilter === 'health'}
             />
             <CategoryIconBox 
               onClick={() => handleCategoryClick('digital')} 
               icon={LinkIcon} 
               title={lang === 'en' ? 'DIGITAL' : 'ডিজিটাল'} 
               color="bg-indigo-600" 
               count="9+ TOOLS" 
               active={activeFilter === 'digital'}
             />
          </div>
        </div>
      </section>

      {/* Tools Library Section - Conditional Rendering */}
      {activeFilter && (
        <section ref={toolsSectionRef} className="max-w-6xl mx-auto px-4 scroll-mt-32 animate-in fade-in slide-in-from-bottom-12 duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-100 pb-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                 <Sparkles size={14} /> Recommended for you
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                {getCategoryTitle()}
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl">
                Explore our selection of professional {activeFilter} tools designed for precision and speed.
              </p>
            </div>
            <button 
              onClick={() => setActiveFilter(null)}
              className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-500 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Close Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {filteredTools.map((tool) => (
               <Link 
                 key={tool.id} 
                 to={tool.path}
                 className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-400 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] transition-all group relative overflow-hidden flex flex-col h-full"
               >
                  <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 mb-6 shadow-inner">
                    <tool.icon size={24} />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors leading-tight mb-2">{tool.name}</h4>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Start Calculation</span>
                     <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                  </div>
               </Link>
             ))}
          </div>
          
          <div className="mt-20 p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
             <div>
                <h4 className="text-xl font-black text-indigo-900 mb-2">Can't find what you're looking for?</h4>
                <p className="text-indigo-700/70 font-medium">Try another category or use our global search in the header.</p>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                   All Categories
                </button>
             </div>
          </div>
        </section>
      )}

      {/* SEO Content Section (For Crawlers) */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-10">
        <h2 className="text-3xl font-black text-slate-800">Why Use CalcMate Tools?</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
           <div className="space-y-4">
             <h4 className="font-bold text-slate-800 flex items-center gap-2">
               <ShieldCheck className="text-emerald-500" size={20} /> 100% Accurate & Reliable
             </h4>
             <p className="text-slate-500 text-sm leading-relaxed">Our algorithms are cross-verified with global financial standards and local regulations in Bangladesh, ensuring you get the most precise results every time.</p>
           </div>
           <div className="space-y-4">
             <h4 className="font-bold text-slate-800 flex items-center gap-2">
               <Zap className="text-amber-500" size={20} /> Fast & Mobile Friendly
             </h4>
             <p className="text-slate-500 text-sm leading-relaxed">CalcMate is built for speed. Whether you are on a smartphone or a desktop, our tools load instantly and work seamlessly even on slow connections.</p>
           </div>
           <div className="space-y-4">
             <h4 className="font-bold text-slate-800 flex items-center gap-2">
               <Globe className="text-blue-500" size={20} /> Localized for Bangladesh
             </h4>
             <p className="text-slate-500 text-sm leading-relaxed">From Sanchaypatra profit calculations to NBR Tax rules, we provide tools specifically tailored for the Bangladeshi audience while maintaining global standards.</p>
           </div>
           <div className="space-y-4">
             <h4 className="font-bold text-slate-800 flex items-center gap-2">
               <Heart className="text-rose-500" size={20} /> Always Free to Use
             </h4>
             <p className="text-slate-500 text-sm leading-relaxed">No subscriptions, no hidden fees. CalcMate is a community-driven initiative to provide high-quality digital utilities to everyone without any cost.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
