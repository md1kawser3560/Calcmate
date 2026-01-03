import React, { useState, useEffect } from 'react';
import { Percent, ArrowRight, RefreshCcw, Info, Share2, Check, Trash2 } from 'lucide-react';
import { useLanguage } from '../App';

const PercentageCalculator = () => {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Type 1: What is X% of Y?
  const [p1, setP1] = useState<string>('10');
  const [v1, setV1] = useState<string>('100');
  const [res1, setRes1] = useState<string>('0');

  // Type 2: X is what percent of Y?
  const [v2a, setV2a] = useState<string>('20');
  const [v2b, setV2b] = useState<string>('200');
  const [res2, setRes2] = useState<string>('0');

  // Type 3: Percentage increase/decrease
  const [v3a, setV3a] = useState<string>('100');
  const [v3b, setV3b] = useState<string>('150');
  const [res3, setRes3] = useState<string>('0');

  // Helper to parse English and Bengali digits
  const toEnglishDigits = (str: string): string => {
    return str.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
  };

  const cleanInput = (val: string): string => {
    const cleaned = toEnglishDigits(val).replace(/[^0-9.]/g, '');
    // Prevent multiple dots
    const parts = cleaned.split('.');
    return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
  };

  useEffect(() => {
    // Calc 1
    const valP1 = parseFloat(cleanInput(p1)) || 0;
    const valV1 = parseFloat(cleanInput(v1)) || 0;
    setRes1(((valP1 / 100) * valV1).toFixed(2));

    // Calc 2
    const valV2a = parseFloat(cleanInput(v2a)) || 0;
    const valV2b = parseFloat(cleanInput(v2b)) || 0;
    if (valV2b !== 0) {
      setRes2(((valV2a / valV2b) * 100).toFixed(2));
    } else {
      setRes2('0');
    }

    // Calc 3
    const valV3a = parseFloat(cleanInput(v3a)) || 0;
    const valV3b = parseFloat(cleanInput(v3b)) || 0;
    if (valV3a !== 0) {
      const diff = valV3b - valV3a;
      setRes3(((diff / valV3a) * 100).toFixed(2));
    } else {
      setRes3('0');
    }
  }, [p1, v1, v2a, v2b, v3a, v3b]);

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(`${label}: ${val}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const InputBox = ({ value, onChange, label, suffix }: any) => (
    <div className="flex-1 w-full space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{label}</label>
      <div className="relative">
        <input 
          type="text"
          inputMode="decimal"
          value={value} 
          onChange={(e) => onChange(cleanInput(e.target.value))} 
          className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all shadow-inner"
          placeholder="0"
        />
        {suffix && <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
          <Percent size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Smart Percentage Calculator' : 'স্মার্ট পার্সেন্টেজ ক্যালকুলেটর'}
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            {lang === 'en' ? 'Quickly calculate percentages, increases, and ratios.' : 'সহজেই শতাংশ, বৃদ্ধি এবং অনুপাত হিসাব করুন।'}
          </p>
        </div>
      </div>

      <div className="space-y-8 px-2">
        {/* Type 1 Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
            <Percent size={80} />
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">{lang === 'en' ? 'Option 1: Basic Percentage' : 'অপশন ১: সাধারণ শতাংশ'}</h3>
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <InputBox label={lang === 'en' ? 'Percentage' : 'শতাংশ'} value={p1} onChange={setP1} suffix="%" />
            <div className="text-slate-400 font-black pt-6 uppercase text-xs">{lang === 'en' ? 'Of' : 'এর'}</div>
            <InputBox label={lang === 'en' ? 'Total Value' : 'মোট পরিমাণ'} value={v1} onChange={setV1} />
            <div className="text-slate-400 pt-6 hidden md:block"><ArrowRight /></div>
            <div className="flex-1 w-full p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl flex flex-col items-center justify-center">
               <span className="text-[10px] font-black text-indigo-400 uppercase mb-1">{lang === 'en' ? 'Result' : 'ফলাফল'}</span>
               <span className="text-3xl font-black text-indigo-700">{parseFloat(res1).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Type 2 Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">{lang === 'en' ? 'Option 2: Value to Percentage' : 'অপশন ২: ভ্যালু থেকে শতাংশ'}</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <InputBox label={lang === 'en' ? 'Value A' : 'ভ্যালু A'} value={v2a} onChange={setV2a} />
            <div className="text-slate-400 font-black pt-6 uppercase text-[10px] whitespace-nowrap">{lang === 'en' ? 'is what % of' : 'হলো এর কত %'}</div>
            <InputBox label={lang === 'en' ? 'Value B' : 'ভ্যালু B'} value={v2b} onChange={setV2b} />
            <div className="text-slate-400 pt-6 hidden md:block"><ArrowRight /></div>
            <div className="flex-1 w-full p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex flex-col items-center justify-center">
               <span className="text-[10px] font-black text-emerald-400 uppercase mb-1">{lang === 'en' ? 'Percentage' : 'শতাংশ'}</span>
               <span className="text-3xl font-black text-emerald-700">{res2}%</span>
            </div>
          </div>
        </div>

        {/* Type 3 Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">{lang === 'en' ? 'Option 3: Increase / Decrease' : 'অপশন ৩: বৃদ্ধি বা হ্রাসের হার'}</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <InputBox label={lang === 'en' ? 'Original Value' : 'আগের মান'} value={v3a} onChange={setV3a} />
            <div className="text-slate-400 font-black pt-6 uppercase text-xs">{lang === 'en' ? 'To' : 'থেকে'}</div>
            <InputBox label={lang === 'en' ? 'New Value' : 'বর্তমান মান'} value={v3b} onChange={setV3b} />
            <div className="text-slate-400 pt-6 hidden md:block"><ArrowRight /></div>
            <div className={`flex-1 w-full p-5 border-2 rounded-2xl flex flex-col items-center justify-center ${parseFloat(res3) >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
               <span className={`text-[10px] font-black uppercase mb-1 ${parseFloat(res3) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {parseFloat(res3) >= 0 ? (lang === 'en' ? 'Increase' : 'বৃদ্ধি') : (lang === 'en' ? 'Decrease' : 'হ্রাস')}
               </span>
               <span className="text-3xl font-black">{Math.abs(parseFloat(res3))}%</span>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 flex flex-col md:flex-row items-start md:items-center gap-6">
           <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600">
              <Info size={24} />
           </div>
           <div className="flex-1">
              <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-wider">{lang === 'en' ? 'Quick Calculation Tips' : 'দ্রুত হিসাবের টিপস'}</h4>
              <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                {lang === 'en' ? 'Percentages help you compare ratios easily. Ensure your initial values are correct for accurate results.' : 'পার্সেন্টেজ আপনাকে বিভিন্ন অনুপাত সহজেই তুলনা করতে সাহায্য করে। সঠিক ফলাফলের জন্য ইনপুটগুলো পুনরায় যাচাই করে নিন।'}
              </p>
           </div>
           <button 
            onClick={() => { setP1('10'); setV1('100'); setV2a('20'); setV2b('200'); setV3a('100'); setV3b('150'); }}
            className="p-4 bg-white hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-2xl shadow-sm transition-all active:scale-95"
            title="Reset All"
           >
             <RefreshCcw size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;