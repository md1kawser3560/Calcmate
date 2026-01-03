
import React, { useState, useEffect } from 'react';
import { Scale, Info, Share2, Check, ArrowRight, User, Target, Zap, Ruler, Activity } from 'lucide-react';
import { useLanguage } from '../App';

const IdealWeightCalculator = () => {
  const { lang, t } = useLanguage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number>(170);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const calculateIdealWeight = () => {
    // 1 inch = 2.54 cm
    // 5 feet = 60 inches
    const heightInInches = height / 2.54;
    const inchesOverFiveFeet = Math.max(0, heightInInches - 60);

    // Robinson Formula (1983)
    let robinson = gender === 'male' 
      ? 52 + (1.9 * inchesOverFiveFeet)
      : 49 + (1.7 * inchesOverFiveFeet);

    // Miller Formula (1983)
    let miller = gender === 'male'
      ? 56.2 + (1.41 * inchesOverFiveFeet)
      : 53.1 + (1.36 * inchesOverFiveFeet);

    // Devine Formula (1974)
    let devine = gender === 'male'
      ? 50 + (2.3 * inchesOverFiveFeet)
      : 45.5 + (2.3 * inchesOverFiveFeet);

    // Hamwi Formula (1964)
    let hamwi = gender === 'male'
      ? 48.0 + (2.7 * inchesOverFiveFeet)
      : 45.5 + (2.2 * inchesOverFiveFeet);

    // BMI range (18.5 to 25)
    const heightInMeters = height / 100;
    const bmiMin = 18.5 * (heightInMeters * heightInMeters);
    const bmiMax = 25 * (heightInMeters * heightInMeters);

    setResults({
      robinson: robinson.toFixed(1),
      miller: miller.toFixed(1),
      devine: devine.toFixed(1),
      hamwi: hamwi.toFixed(1),
      healthyRange: {
        min: bmiMin.toFixed(1),
        max: bmiMax.toFixed(1)
      }
    });
  };

  useEffect(() => {
    if (height > 0) {
      calculateIdealWeight();
    }
  }, [gender, height]);

  const handleShare = () => {
    const text = `My ideal weight according to Devine formula is ${results?.devine} kg. Healthy range: ${results?.healthyRange.min} - ${results?.healthyRange.max} kg. Calculated via Vuxalo Tool.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-teal-600 rounded-2xl text-white shadow-xl shadow-teal-100">
            <Scale size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Ideal Weight Calculator' : 'আদর্শ ওজন ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'Multi-formula calculation for body perfection' : 'বিভিন্ন বিজ্ঞানসম্মত সূত্র অনুযায়ী আপনার আদর্শ ওজন জানুন'}
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
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (cm)</label>
                    <span className="text-2xl font-black text-teal-600">{height} <span className="text-xs text-slate-300">cm</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="250" 
                    value={height} 
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between mt-4">
                    <input 
                      type="number" 
                      value={height} 
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-teal-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-teal-50 p-8 rounded-[2.5rem] border border-teal-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-teal-600">
                <Target size={20} />
             </div>
             <p className="text-sm text-teal-800 font-medium leading-relaxed">
               {lang === 'en' 
                ? 'Ideal weight depends on frame size and muscle mass. Formulas provide a guideline, but overall health is more than just a number.' 
                : 'আদর্শ ওজন শরীরের গঠন এবং পেশীর ওপর নির্ভর করে। এই সূত্রগুলো আপনাকে একটি সঠিক ধারণা দিবে, তবে সুস্থ থাকাটাই আসল কথা।'}
             </p>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Scale size={120} fill="currentColor" className="text-teal-500" />
             </div>
             
             <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] mb-4">Estimated Healthy Range</h3>
             <div className="flex items-end gap-3 mb-10">
                <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{results?.healthyRange.min} - {results?.healthyRange.max}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest pb-1">kg</span>
             </div>

             <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="text-[10px] font-black text-indigo-400 uppercase mb-2">Devine Formula (Classic)</div>
                   <div className="text-3xl font-black">{results?.devine} <span className="text-xs text-slate-500">kg</span></div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="text-[10px] font-black text-emerald-400 uppercase mb-2">Robinson Formula</div>
                   <div className="text-3xl font-black">{results?.robinson} <span className="text-xs text-slate-500">kg</span></div>
                </div>
             </div>

             <div className="mt-8 flex gap-4 relative z-10">
                <button 
                  onClick={handleShare}
                  className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-100'}`}
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? 'Copied Range' : 'Share Results'}
                </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
               <Info size={16} className="text-indigo-600" /> Comparison of Formulas
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">Miller Formula</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">Modern standard</p>
                   </div>
                   <div className="text-xl font-black text-indigo-600">{results?.miller} kg</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">Hamwi Formula</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">Legacy calculation</p>
                   </div>
                   <div className="text-xl font-black text-rose-600">{results?.hamwi} kg</div>
                </div>
                <div className="p-4 bg-indigo-50/50 rounded-2xl text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                  * Formulas for adults only. The results are calculated based on height in inches over 5 feet baseline.
                </div>
             </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                <Activity size={24} />
             </div>
             <div>
                <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-wider">Health Note</h4>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'While these formulas give a rough idea of what your weight should be, factors like muscle percentage and bone density matter. For better health analysis, check our BMI and Body Fat tools.' : 'এই সূত্রগুলো আপনার ওজনের একটি গাণিতিক ধারণা দিলেও, শরীরের পেশীর পরিমাণ এবং হাড়ের ঘনত্ব অনেক গুরুত্বপূর্ণ। আরও সঠিক বিশ্লেষণের জন্য আমাদের বিএমআই এবং বডি ফ্যাট টুলগুলো ব্যবহার করুন।'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdealWeightCalculator;
