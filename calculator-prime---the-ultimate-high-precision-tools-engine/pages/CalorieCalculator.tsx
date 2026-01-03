
import React, { useState, useEffect } from 'react';
import { Flame, Info, Share2, Check, ArrowRight, Activity, User, Target, Zap } from 'lucide-react';
import { useLanguage } from '../App';

const activityLevels = [
  { id: 'sedentary', labelEn: 'Sedentary (Little/No Exercise)', labelBn: 'অলস (ব্যায়াম নেই)', factor: 1.2 },
  { id: 'light', labelEn: 'Lightly Active (1-3 days/week)', labelBn: 'হালকা (সপ্তাহে ১-৩ দিন)', factor: 1.375 },
  { id: 'moderate', labelEn: 'Moderately Active (3-5 days/week)', labelBn: 'মাঝারি (সপ্তাহে ৩-৫ দিন)', factor: 1.55 },
  { id: 'active', labelEn: 'Very Active (6-7 days/week)', labelBn: 'খুব সক্রিয় (সপ্তাহে ৬-৭ দিন)', factor: 1.725 },
  { id: 'extra', labelEn: 'Extra Active (Very Hard Work)', labelBn: 'অতিরিক্ত সক্রিয় (কঠিন পরিশ্রম)', factor: 1.9 },
];

const CalorieCalculator = () => {
  const { lang, t } = useLanguage();
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [activity, setActivity] = useState(activityLevels[0]);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const calculateCalories = () => {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = bmr * activity.factor;

    setResults({
      maintain: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      extremeLoss: Math.round(tdee - 1000),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
    });
  };

  useEffect(() => {
    calculateCalories();
  }, [age, gender, weight, height, activity]);

  const handleShare = () => {
    const text = `My maintenance calories: ${results?.maintain} kcal/day. Calculated via Vuxalo Calorie Tool.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-xl shadow-orange-100">
            <Flame size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Smart Calorie Calculator' : 'স্মার্ট ক্যালরি ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'Scientific calculation based on Mifflin-St Jeor Equation' : 'বিজ্ঞানসম্মত উপায়ে আপনার প্রয়োজনীয় ক্যালরি জানুন'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            {/* Gender Toggle */}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Age (Years)</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Weight (kg)</label>
                <input 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Height (cm)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white font-black text-2xl text-slate-800 transition-all"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Activity Level</label>
              <div className="space-y-2">
                 {activityLevels.map(level => (
                   <button 
                    key={level.id}
                    onClick={() => setActivity(level)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${activity.id === level.id ? 'bg-orange-50 border-orange-400' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                   >
                     <div className="flex justify-between items-center">
                        <span className={`font-bold text-sm ${activity.id === level.id ? 'text-orange-900' : 'text-slate-600'}`}>
                          {lang === 'en' ? level.labelEn : level.labelBn}
                        </span>
                        {activity.id === level.id && <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>}
                     </div>
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Flame size={120} fill="currentColor" className="text-orange-500" />
             </div>
             
             <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-4">Maintenance Calories</h3>
             <div className="flex items-end gap-3 mb-10">
                <span className="text-7xl font-black tracking-tighter leading-none">{results?.maintain}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest pb-1">kcal / day</span>
             </div>

             <div className="grid md:grid-cols-2 gap-4 relative z-10">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase mb-2">
                     <Target size={12} /> Weight Loss (0.5 kg/week)
                   </div>
                   <div className="text-3xl font-black">{results?.weightLoss} <span className="text-xs text-slate-500">kcal</span></div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase mb-2">
                     <Target size={12} /> Weight Gain (0.5 kg/week)
                   </div>
                   <div className="text-3xl font-black">{results?.weightGain} <span className="text-xs text-slate-500">kcal</span></div>
                </div>
             </div>

             <div className="mt-8 flex gap-4">
                <button 
                  onClick={handleShare}
                  className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-100'}`}
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? 'Copied Results' : 'Share Results'}
                </button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
               <Info size={16} className="text-indigo-600" /> More Specific Goals
             </h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{lang === 'en' ? 'Mild Weight Loss' : 'সামান্য ওজন কমানো'}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">0.25 kg / week</p>
                   </div>
                   <div className="text-xl font-black text-indigo-600">{results?.mildLoss} kcal</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{lang === 'en' ? 'Extreme Weight Loss' : 'দ্রুত ওজন কমানো'}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">1.0 kg / week</p>
                   </div>
                   <div className="text-xl font-black text-rose-600">{results?.extremeLoss} kcal</div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{lang === 'en' ? 'Mild Weight Gain' : 'সামান্য ওজন বাড়ানো'}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">0.25 kg / week</p>
                   </div>
                   <div className="text-xl font-black text-emerald-600">{results?.mildGain} kcal</div>
                </div>
             </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                <Activity size={24} />
             </div>
             <div>
                <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-wider">Health Disclaimer</h4>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'These values are estimates. Actual calorie needs vary based on genetics, body composition, and metabolism. Consult a nutritionist for a precise meal plan.' : 'এই হিসাবগুলো কেবল একটি ধারণা। জিনগত বৈশিষ্ট্য এবং মেটাবলিজমের কারণে প্রয়োজনীয় ক্যালরি ভিন্ন হতে পারে। সঠিক ডায়েট চার্টের জন্য একজন বিশেষজ্ঞের পরামর্শ নিন।'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
