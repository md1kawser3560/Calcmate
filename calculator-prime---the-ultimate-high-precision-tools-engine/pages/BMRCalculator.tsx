
import React, { useState, useEffect } from 'react';
import { HeartPulse, Info, Share2, Check, ArrowRight, Activity, User, Target, Zap, Ruler, Weight } from 'lucide-react';
import { useLanguage } from '../App';

const BMRCalculator = () => {
  const { lang, t } = useLanguage();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    // Male: BMR = 10w + 6.25h - 5a + 5
    // Female: BMR = 10w + 6.25h - 5a - 161
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    setResult(Math.round(bmr));
  };

  useEffect(() => {
    if (age > 0 && weight > 0 && height > 0) {
      calculateBMR();
    }
  }, [gender, age, weight, height]);

  const handleShare = () => {
    const text = `My Basal Metabolic Rate (BMR) is ${result} kcal/day. Calculated via Vuxalo BMR Tool.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <HeartPulse size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'BMR Calculator' : 'বিএমআর ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'Calculate your Basal Metabolic Rate precisely' : 'আপনার শরীরের মৌলিক শক্তি খরচের মাত্রা জানুন'}
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
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Age (Years)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Weight (kg)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                      />
                      <Weight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Height (cm)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                      />
                      <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200" size={20} />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <HeartPulse size={120} fill="currentColor" className="text-indigo-500" />
             </div>
             
             <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Your Estimated BMR</h3>
             <div className="flex items-end gap-3 mb-10">
                <span className="text-7xl font-black tracking-tighter leading-none">{result !== null ? result : '--'}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest pb-1">Calories / Day</span>
             </div>

             <p className="text-slate-400 font-medium leading-relaxed max-w-md mb-8 relative z-10">
               {lang === 'en' 
                 ? 'This is the minimum energy your body requires to function at rest, including breathing and blood circulation.' 
                 : 'এটি আপনার শরীরের বিশ্রামরত অবস্থায় বেঁচে থাকার জন্য প্রয়োজনীয় ন্যূনতম শক্তির পরিমাণ (শ্বাস-প্রশ্বাস, রক্ত সঞ্চালন ইত্যাদি)।'}
             </p>

             <div className="mt-8 flex gap-4 relative z-10">
                <button 
                  onClick={handleShare}
                  className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-100'}`}
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? 'Copied Results' : 'Share Result'}
                </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
               <Info size={16} className="text-indigo-600" /> Daily Calorie Needs
             </h3>
             <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-4">{lang === 'en' ? 'To get your total daily energy expenditure (TDEE), multiply your BMR by an activity factor:' : 'আপনার সারাদিনের মোট ক্যালরি খরচ (TDEE) জানতে নিচের ফ্যাক্টর দিয়ে গুণ করুন:'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Sedentary</span>
                      <span className="font-bold text-slate-700">BMR x 1.2</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Light Activity</span>
                      <span className="font-bold text-slate-700">BMR x 1.375</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Moderate Activity</span>
                      <span className="font-bold text-slate-700">BMR x 1.55</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Very Active</span>
                      <span className="font-bold text-slate-700">BMR x 1.725</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                <Activity size={24} />
             </div>
             <div>
                <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-wider">Note</h4>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'BMR decreases as you age, but increases with muscle mass. This tool provides a mathematical estimation. Consult a professional for health decisions.' : 'বয়স বাড়ার সাথে বিএমআর কমে, তবে পেশী বেশি থাকলে বিএমআর বাড়ে। এই টুলটি গাণিতিক ধারণা দেয় মাত্র। চিকিৎসার প্রয়োজনে ডাক্তারের পরামর্শ নিন।'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMRCalculator;
