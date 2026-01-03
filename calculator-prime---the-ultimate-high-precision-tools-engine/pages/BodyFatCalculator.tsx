
import React, { useState, useEffect } from 'react';
import { Gauge, Info, Share2, Check, ArrowRight, Activity, User, Target, Zap, Ruler } from 'lucide-react';
import { useLanguage } from '../App';

const BodyFatCalculator = () => {
  const { lang, t } = useLanguage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number>(170);
  const [neck, setNeck] = useState<number>(40);
  const [waist, setWaist] = useState<number>(85);
  const [hip, setHip] = useState<number>(90); // Only for women
  const [result, setResult] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const calculateBodyFat = () => {
    let bodyFat = 0;
    
    // US Navy Method Formula (values in cm)
    if (gender === 'male') {
      // 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      // 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    const roundedResult = Math.max(0.1, parseFloat(bodyFat.toFixed(1)));
    setResult(roundedResult);
    setCategory(getCategory(roundedResult, gender));
  };

  const getCategory = (bf: number, gen: string) => {
    if (gen === 'male') {
      if (bf < 6) return lang === 'en' ? 'Essential Fat' : 'অপরিহার্য ফ্যাট';
      if (bf < 14) return lang === 'en' ? 'Athletes' : 'অ্যাথলিট';
      if (bf < 18) return lang === 'en' ? 'Fitness' : 'ফিটনেস';
      if (bf < 25) return lang === 'en' ? 'Average' : 'সাধারণ';
      return lang === 'en' ? 'Obese' : 'স্থূল';
    } else {
      if (bf < 14) return lang === 'en' ? 'Essential Fat' : 'অপরিহার্য ফ্যাট';
      if (bf < 21) return lang === 'en' ? 'Athletes' : 'অ্যাথলিট';
      if (bf < 25) return lang === 'en' ? 'Fitness' : 'ফিটনেস';
      if (bf < 32) return lang === 'en' ? 'Average' : 'সাধারণ';
      return lang === 'en' ? 'Obese' : 'স্থূল';
    }
  };

  useEffect(() => {
    if (height && neck && waist && (gender === 'male' || hip)) {
      calculateBodyFat();
    }
  }, [gender, height, neck, waist, hip]);

  const handleShare = () => {
    const text = `My body fat percentage is ${result}% (${category}). Calculated via Vuxalo Body Fat Tool.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-100">
            <Gauge size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Body Fat Calculator' : 'বডি ফ্যাট ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'U.S. Navy Method for high precision body composition' : 'ইউএস নেভি মেথড অনুযায়ী আপনার শরীরের ফ্যাট জানুন'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">1. Select Gender</label>
              <div className="flex gap-4">
                 <button 
                  onClick={() => setGender('male')}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${gender === 'male' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                 >
                   <User size={18} /> {lang === 'en' ? 'Male' : 'পুরুষ'}
                 </button>
                 <button 
                  onClick={() => setGender('female')}
                  className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold ${gender === 'female' ? 'bg-rose-50 border-rose-600 text-rose-700' : 'bg-slate-50 border-transparent text-slate-400'}`}
                 >
                   <User size={18} /> {lang === 'en' ? 'Female' : 'নারী'}
                 </button>
              </div>
            </div>

            <div className="space-y-6">
               <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Height (cm)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={height} 
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                    <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Neck (cm)</label>
                    <input 
                      type="number" 
                      value={neck} 
                      onChange={(e) => setNeck(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Waist (cm)</label>
                    <input 
                      type="number" 
                      value={waist} 
                      onChange={(e) => setWaist(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                  </div>
               </div>

               {gender === 'female' && (
                 <div className="group animate-in slide-in-from-top-4 duration-300">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Hip (cm)</label>
                    <input 
                      type="number" 
                      value={hip} 
                      onChange={(e) => setHip(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-emerald-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Gauge size={120} fill="currentColor" className="text-emerald-500" />
             </div>
             
             <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Your Body Fat Percentage</h3>
             <div className="flex items-end gap-3 mb-10">
                <span className="text-7xl font-black tracking-tighter leading-none">{result !== null ? result : '--'}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest pb-1">%</span>
             </div>

             <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-emerald-50">{category || 'Input Values'}</span>
             </div>

             <div className="mt-8 flex gap-4 relative z-10">
                <button 
                  onClick={handleShare}
                  className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-100'}`}
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? 'Copied Results' : 'Share Analysis'}
                </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
               <Info size={16} className="text-indigo-600" /> Body Fat Categories
             </h3>
             <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Ideal Ranges (Men)</p>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="font-bold text-slate-600">Essential Fat</span>
                      <span className="font-black">2 - 5%</span>
                   </div>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="font-bold text-slate-600">Athletes</span>
                      <span className="font-black">6 - 13%</span>
                   </div>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="font-bold text-slate-600">Fitness</span>
                      <span className="font-black">14 - 17%</span>
                   </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Ideal Ranges (Women)</p>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="font-bold text-slate-600">Essential Fat</span>
                      <span className="font-black">10 - 13%</span>
                   </div>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="font-bold text-slate-600">Athletes</span>
                      <span className="font-black">14 - 20%</span>
                   </div>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="font-bold text-slate-600">Fitness</span>
                      <span className="font-black">21 - 24%</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600 shrink-0">
                <Activity size={24} />
             </div>
             <div>
                <h4 className="font-black text-emerald-900 text-sm mb-1 uppercase tracking-wider">Health Tip</h4>
                <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'While BMI only considers weight and height, Body Fat percentage tells you more about your actual body composition. To reduce body fat, combine strength training with a balanced diet.' : 'বিএমআই কেবল ওজন এবং উচ্চতা বিবেচনা করে, কিন্তু বডি ফ্যাট শতাংশ আপনার শরীরের প্রকৃত গঠন সম্পর্কে ধারণা দেয়। চর্বি কমাতে নিয়মিত ব্যায়ামের পাশাপাশি সুষম খাবার নিশ্চিত করুন।'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFatCalculator;
