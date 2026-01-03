
import React, { useState, useEffect } from 'react';
import { Triangle, Info, Share2, Check, RefreshCcw, ArrowRight, Zap, ListChecks, HelpCircle } from 'lucide-react';
import { useLanguage } from '../App';

type CalculationTarget = 'hypotenuse' | 'sideA' | 'sideB';

const PythagoreanCalculator = () => {
  const { lang, t } = useLanguage();
  const [target, setTarget] = useState<CalculationTarget>('hypotenuse');
  const [sideA, setSideA] = useState<string>('3');
  const [sideB, setSideB] = useState<string>('4');
  const [sideC, setSideC] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(sideC) || 0;
    const calcSteps: string[] = [];

    if (target === 'hypotenuse') {
      if (a > 0 && b > 0) {
        const val = Math.sqrt(a * a + b * b);
        setResult(val);
        calcSteps.push(`c² = a² + b²`);
        calcSteps.push(`c² = ${a}² + ${b}²`);
        calcSteps.push(`c² = ${a * a} + ${b * b}`);
        calcSteps.push(`c² = ${a * a + b * b}`);
        calcSteps.push(`c = √${a * a + b * b}`);
        calcSteps.push(`c = ${val.toFixed(4)}`);
      } else {
        setResult(null);
      }
    } else if (target === 'sideA') {
      if (c > a && c > 0 && b > 0) {
        const val = Math.sqrt(c * c - b * b);
        setResult(val);
        calcSteps.push(`a² = c² - b²`);
        calcSteps.push(`a² = ${c}² - ${b}²`);
        calcSteps.push(`a² = ${c * c} - ${b * b}`);
        calcSteps.push(`a² = ${c * c - b * b}`);
        calcSteps.push(`a = √${c * c - b * b}`);
        calcSteps.push(`a = ${val.toFixed(4)}`);
      } else {
        setResult(null);
      }
    } else if (target === 'sideB') {
      if (c > b && c > 0 && a > 0) {
        const val = Math.sqrt(c * c - a * a);
        setResult(val);
        calcSteps.push(`b² = c² - a²`);
        calcSteps.push(`b² = ${c}² - ${a}²`);
        calcSteps.push(`b² = ${c * c} - ${a * a}`);
        calcSteps.push(`b² = ${c * c - a * a}`);
        calcSteps.push(`b = √${c * c - a * a}`);
        calcSteps.push(`b = ${val.toFixed(4)}`);
      } else {
        setResult(null);
      }
    }
    setSteps(calcSteps);
  };

  useEffect(() => {
    calculate();
  }, [sideA, sideB, sideC, target]);

  const handleShare = () => {
    const text = `Pythagorean Theorem: a=${sideA}, b=${sideB}, c=${result?.toFixed(2)}. Calculated on Calculator Prime.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSideA('3');
    setSideB('4');
    setSideC('');
    setTarget('hypotenuse');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-2xl shadow-indigo-100 flex items-center justify-center">
            <Triangle size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'Pythagorean Theorem' : 'পিথাগোরাস ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-base">
              {lang === 'en' ? 'Master right triangle geometry with step-by-step logic' : 'সমকোণী ত্রিভুজের বাহু নির্ণয়ের সহজ গাণিতিক সমাধান'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <RefreshCcw size={16} /> {lang === 'en' ? 'Reset Calculation' : 'রিসেট করুন'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="space-y-4">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">1. What are we solving for?</label>
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { id: 'hypotenuse', label: 'Side C', icon: 'c' },
                   { id: 'sideA', label: 'Side A', icon: 'a' },
                   { id: 'sideB', label: 'Side B', icon: 'b' }
                 ].map(opt => (
                   <button 
                    key={opt.id}
                    onClick={() => {
                        setTarget(opt.id as CalculationTarget);
                        setSideA(''); setSideB(''); setSideC('');
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${target === opt.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                   >
                     <span className="font-black text-xl italic">{opt.icon}</span>
                     <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                   </button>
                 ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">
                  {target === 'sideA' ? 'Hypotenuse (c)' : 'Side (a)'}
                </label>
                <input 
                  type="number" 
                  value={target === 'sideA' ? sideC : sideA}
                  onChange={(e) => target === 'sideA' ? setSideC(e.target.value) : setSideA(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                  placeholder="Enter length..."
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">
                   {target === 'hypotenuse' ? 'Side (b)' : (target === 'sideA' ? 'Side (b)' : 'Hypotenuse (c)')}
                </label>
                <input 
                  type="number" 
                  value={target === 'sideB' ? sideC : sideB}
                  onChange={(e) => target === 'sideB' ? setSideC(e.target.value) : setSideB(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                  placeholder="Enter length..."
                />
              </div>
            </div>

            {/* Triangle Preview */}
            <div className="pt-8 border-t border-slate-50 flex justify-center">
               <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                     <path 
                      d="M 20 80 L 80 80 L 20 20 Z" 
                      fill="none" 
                      stroke={target === 'hypotenuse' ? '#4f46e5' : '#e2e8f0'} 
                      strokeWidth="3" 
                      className={`transition-all duration-500 ${target === 'hypotenuse' ? 'stroke-indigo-600' : 'stroke-slate-200'}`}
                     />
                     <line x1="20" y1="80" x2="20" y2="20" strokeWidth="4" className={`transition-all duration-500 ${target === 'sideA' ? 'stroke-indigo-600' : 'stroke-slate-300'}`} />
                     <line x1="20" y1="80" x2="80" y2="80" strokeWidth="4" className={`transition-all duration-500 ${target === 'sideB' ? 'stroke-indigo-600' : 'stroke-slate-300'}`} />
                     <line x1="80" y1="80" x2="20" y2="20" strokeWidth="4" className={`transition-all duration-500 ${target === 'hypotenuse' ? 'stroke-indigo-600' : 'stroke-slate-300'}`} />
                     
                     <text x="10" y="55" className={`text-[8px] font-black italic ${target === 'sideA' ? 'fill-indigo-600' : 'fill-slate-400'}`}>a</text>
                     <text x="45" y="92" className={`text-[8px] font-black italic ${target === 'sideB' ? 'fill-indigo-600' : 'fill-slate-400'}`}>b</text>
                     <text x="55" y="45" className={`text-[8px] font-black italic ${target === 'hypotenuse' ? 'fill-indigo-600' : 'fill-slate-400'}`}>c</text>
                  </svg>
                  {/* Right Angle Box */}
                  <div className="absolute left-[20%] bottom-[20%] w-4 h-4 border-l-2 border-t-2 border-slate-300"></div>
               </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                <Info size={24} />
             </div>
             <p className="text-sm text-indigo-800 font-medium leading-relaxed">
               {lang === 'en' 
                ? 'The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides.' 
                : 'পিথাগোরাসের উপপাদ্য অনুযায়ী, একটি সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্র অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রের সমষ্টির সমান।'}
             </p>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <Triangle size={200} fill="currentColor" />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
                  {lang === 'en' ? 'Calculated Result' : 'ফলাফল'}
                </h3>
                
                <div className="flex items-end gap-4 mb-10">
                  <div className="text-7xl md:text-9xl font-black tracking-tighter leading-none">
                    {result !== null ? result.toFixed(2) : '--'}
                  </div>
                  <div className="pb-3">
                    <span className="text-indigo-400 font-black text-2xl italic uppercase">{target === 'hypotenuse' ? 'c' : (target === 'sideA' ? 'a' : 'b')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-12">
                   <div className="px-5 py-2 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">High Precision Mode</span>
                   </div>
                </div>

                <button 
                  onClick={handleShare}
                  className={`w-full py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? 'Copied to Clipboard' : 'Share Result'}
                </button>
             </div>
          </div>

          {/* Steps Display */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
               <ListChecks size={16} className="text-indigo-600" /> {lang === 'en' ? 'Step-by-Step Logic' : 'গাণিতিক ধাপসমূহ'}
             </h3>
             
             {steps.length > 0 ? (
               <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-6 group">
                       <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">
                          {idx + 1}
                       </div>
                       <div className="font-mono text-xl md:text-2xl text-slate-700 font-bold tracking-tight">
                          {step}
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="text-center py-10 opacity-30">
                  <Zap size={40} className="mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Input values to see steps</p>
               </div>
             )}
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
             <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-slate-400" />
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">{lang === 'en' ? 'Geometric Proof' : 'জ্যামিতিক ধারণা'}</h4>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
               {lang === 'en' 
                ? 'This calculator uses the standard Euclidean distance formula. To find a missing leg (a or b), we subtract the square of the known leg from the square of the hypotenuse. The result is always the square root of that difference.' 
                : 'এই ক্যালকুলেটরটি স্ট্যান্ডার্ড ইউক্লিডীয় দূরত্ব সূত্র ব্যবহার করে। একটি অনুপস্থিত বাহু (a বা b) খুঁজে পেতে, আমরা অতিভুজের বর্গ থেকে পরিচিত বাহুর বর্গ বিয়োগ করি। ফলাফল সর্বদা সেই পার্থক্যের বর্গমূল হয়।'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythagoreanCalculator;
