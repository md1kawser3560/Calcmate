
import React, { useState, useEffect } from 'react';
import { Flower, Info, Share2, Check, ArrowRight, Activity, Calendar, Heart, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../App';

const PeriodCalculator = () => {
  const { lang, t } = useLanguage();
  const [lastDate, setLastDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [results, setResults] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const calculatePeriods = () => {
    const predictions = [];
    let currentDate = new Date(lastDate);

    // Calculate for next 4 cycles
    for (let i = 0; i < 4; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + cycleLength);
      
      const ovulationDate = new Date(nextDate);
      ovulationDate.setDate(nextDate.getDate() - 14);

      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(ovulationDate.getDate() - 5);

      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(ovulationDate.getDate() + 1);

      predictions.push({
        id: i,
        start: nextDate,
        ovulation: ovulationDate,
        fertileRange: { start: fertileStart, end: fertileEnd }
      });

      currentDate = new Date(nextDate);
    }
    setResults(predictions);
  };

  useEffect(() => {
    if (lastDate && cycleLength >= 20 && cycleLength <= 45) {
      calculatePeriods();
    }
  }, [lastDate, cycleLength, periodLength]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = () => {
    const text = `My next period is expected on ${formatDate(results[0].start)}. Predicted via Vuxalo Period Tracker.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-500 rounded-2xl text-white shadow-xl shadow-rose-100">
            <Flower size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Period & Ovulation Tracker' : 'মাসিক ও ওভুলেশন ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'Predict your cycles and fertile windows precisely' : 'আপনার মাসিক চক্র এবং উর্বরতার সময় নিখুঁতভাবে জানুন'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">1. Last Period Start Date</label>
              <input 
                type="date" 
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-rose-400 focus:bg-white font-bold text-xl text-slate-800 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
               <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Cycle Length</label>
                    <span className="text-rose-600 font-black">{cycleLength} Days</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="45" 
                    value={cycleLength} 
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
               </div>

               <div className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period Duration</label>
                    <span className="text-rose-600 font-black">{periodLength} Days</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="10" 
                    value={periodLength} 
                    onChange={(e) => setPeriodLength(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
               </div>
            </div>
          </div>

          <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500 shrink-0">
                <Heart size={24} />
             </div>
             <div>
                <h4 className="font-black text-rose-900 text-sm mb-1 uppercase tracking-wider">Health Info</h4>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'Normal cycles range from 21 to 35 days. If yours are consistently outside this range, consider consulting a doctor.' : 'স্বাভাবিক মাসিক চক্র ২১ থেকে ৩৫ দিনের মধ্যে হয়ে থাকে। আপনার চক্র এর বাইরে হলে বিশেষজ্ঞ ডাক্তারের পরামর্শ নেওয়া উচিত।'}
                </p>
             </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          {results.length > 0 && (
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                 <Flower size={150} fill="currentColor" className="text-rose-400" />
               </div>
               
               <div className="relative z-10">
                  <h3 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] mb-4">Estimated Next Period</h3>
                  <div className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">
                    {formatDate(results[0].start)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                       <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase mb-2">
                         <Activity size={12} /> Ovulation Date
                       </div>
                       <div className="text-xl font-black">{formatDate(results[0].ovulation)}</div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                       <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase mb-2">
                         <Zap size={12} /> Fertile Window
                       </div>
                       <div className="text-sm font-bold">
                         {formatDate(results[0].fertileRange.start)} - <br/> {formatDate(results[0].fertileRange.end)}
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleShare}
                    className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
                  >
                    {copied ? <Check size={20} /> : <Share2 size={20} />}
                    {copied ? 'Copied Link' : 'Share Predictions'}
                  </button>
               </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-8 flex items-center gap-2">
               <Calendar size={16} className="text-indigo-600" /> Future Cycle Predictions
             </h3>
             <div className="space-y-4">
                {results.slice(1).map((cycle) => (
                  <div key={cycle.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-rose-200 transition-all">
                    <div className="mb-4 md:mb-0">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Period Starts</p>
                       <p className="text-xl font-black text-slate-800">{formatDate(cycle.start)}</p>
                    </div>
                    <div className="flex gap-8">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Ovulation</p>
                          <p className="text-xs font-bold text-rose-500 text-center">{cycle.ovulation.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'short' })}</p>
                       </div>
                       <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Cycle</p>
                          <p className="text-xs font-bold text-slate-600 text-center">{cycleLength} Days</p>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-black text-indigo-900 text-sm mb-1 uppercase tracking-wider">Privacy Note</h4>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  {lang === 'en' ? 'Your health data is private. Vuxalo does not store or share your cycle information. This tool provides estimates only; cycles can vary due to stress, illness, or diet.' : 'আপনার স্বাস্থ্য তথ্য সম্পূর্ণ ব্যক্তিগত। ভাক্সালো আপনার সাইকেল ডেটা সংরক্ষণ বা শেয়ার করে না। এই টুলটি কেবল একটি ধারণা দেয়; মানসিক চাপ, অসুস্থতা বা খাদ্যাভ্যাসের কারণে চক্রের পরিবর্তন হতে পারে।'}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodCalculator;
