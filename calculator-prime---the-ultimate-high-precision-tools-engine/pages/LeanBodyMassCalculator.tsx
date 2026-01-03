
import React, { useState, useEffect } from 'react';
import { Dumbbell, Info, Share2, Check, ArrowRight, User, Activity, Ruler, Target, Zap } from 'lucide-react';
import { useLanguage } from '../App';

const LeanBodyMassCalculator = () => {
  const { lang, t } = useLanguage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const calculateLBM = () => {
    // Weight in kg, Height in cm
    
    // 1. Boer Formula
    let boer = gender === 'male'
      ? (0.407 * weight) + (0.267 * height) - 19.2
      : (0.252 * weight) + (0.473 * height) - 48.3;

    // 2. James Formula
    let james = gender === 'male'
      ? (1.1 * weight) - (128 * Math.pow(weight / height, 2))
      : (1.07 * weight) - (148 * Math.pow(weight / height, 2));

    // 3. Hume Formula
    let hume = gender === 'male'
      ? (0.32810 * weight) + (0.33929 * height) - 29.5336
      : (0.29569 * weight) + (0.41813 * height) - 43.2933;

    // Ensure values aren't negative or nonsensical
    boer = Math.max(1, boer);
    james = Math.max(1, james);
    hume = Math.max(1, hume);

    // Derived Body Fat % based on Boer (common approach)
    const fatMass = weight - boer;
    const fatPercentage = (fatMass / weight) * 100;
    const leanPercentage = (boer / weight) * 100;

    setResults({
      boer: boer.toFixed(1),
      james: james.toFixed(1),
      hume: hume.toFixed(1),
      fatPercentage: fatPercentage.toFixed(1),
      leanPercentage: leanPercentage.toFixed(1)
    });
  };

  useEffect(() => {
    if (weight > 0 && height > 0) {
      calculateLBM();
    }
  }, [gender, weight, height]);

  const handleShare = () => {
    const text = `My Lean Body Mass is ${results?.boer} kg (${results?.leanPercentage}% of total weight). Calculated via Calculator Prime.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <Dumbbell size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Lean Body Mass Calculator' : 'মাংসপেশির ওজন ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'Scientific estimation of your fat-free weight' : 'শরীরের চর্বিহীন মাংসপেশি ও হাড়ের মোট ওজন জানুন'}
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                    <span className="text-xl font-black text-indigo-600">{weight} <span className="text-xs text-slate-300">kg</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="250" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="mt-4">
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                  </div>
               </div>

               <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (cm)</label>
                    <span className="text-xl font-black text-indigo-600">{height} <span className="text-xs text-slate-300">cm</span></span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="250" 
                    value={height} 
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="mt-4">
                    <input 
                      type="number" 
                      value={height} 
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                    />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                <Target size={20} />
             </div>
             <p className="text-sm text-indigo-800 font-medium leading-relaxed">
               {lang === 'en' 
                ? 'Lean Body Mass (LBM) includes bones, muscles, water, and ligaments. It helps you understand how much of your weight is not body fat.' 
                : 'শরীরের চর্বিহীন ওজন বা লিন বডি মাস-এ হাড়, মাংসপেশি এবং পানির ওজন যুক্ত থাকে। এটি আপনাকে বুঝতে সাহায্য করে আপনার ওজনের কতটুকু চর্বি নয়।'}
             </p>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Activity size={150} fill="currentColor" className="text-indigo-400" />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Lean Body Mass (Boer)</h3>
                <div className="flex items-end gap-3 mb-10">
                    <span className="text-7xl md:text-8xl font-black tracking-tighter leading-none">{results?.boer}</span>
                    <span className="text-slate-400 font-bold uppercase tracking-widest pb-1">kg</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                     <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase mb-2">
                       Lean Mass Percentage
                     </div>
                     <div className="text-3xl font-black">{results?.leanPercentage}%</div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                     <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase mb-2">
                       Estimated Body Fat
                     </div>
                     <div className="text-3xl font-black">{results?.fatPercentage}%</div>
                  </div>
                </div>

                <button 
                  onClick={handleShare}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-100'}`}
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? 'Copied Stats' : 'Share My Body Composition'}
                </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
               <Info size={16} className="text-indigo-600" /> Alternative Formula Results
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">James Formula</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">Classic standard</p>
                   </div>
                   <div className="text-xl font-black text-indigo-600">{results?.james} kg</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">Hume Formula</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">Modern research-based</p>
                   </div>
                   <div className="text-xl font-black text-indigo-600">{results?.hume} kg</div>
                </div>
             </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                <Activity size={24} />
             </div>
             <div>
                <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-wider">Health Info</h4>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'LBM is essential for determining your protein requirements and overall fitness goals. A higher LBM usually means a faster metabolism. For clinical accuracy, consider a DEXA scan.' : 'আপনার প্রোটিনের চাহিদা এবং ফিটনেস লক্ষ্য নির্ধারণের জন্য এলবিএম জানা জরুরি। লিন বডি মাস যত বেশি হবে, মেটাবলিজম তত দ্রুত কাজ করবে। নিখুঁত ফলাফলের জন্য ডেক্সা (DEXA) স্ক্যান করার পরামর্শ দেওয়া হয়।'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeanBodyMassCalculator;
