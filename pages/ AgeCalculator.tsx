import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Gift, RefreshCcw, Share2, Check, ArrowRight, Star, Heart } from 'lucide-react';
import { useLanguage } from '../App';

const AgeCalculator = () => {
  const { lang, t } = useLanguage();
  const [birthDate, setBirthDate] = useState<string>('1995-01-01');
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const calculateAge = () => {
    if (!birthDate) return;
    
    const birth = new Date(birthDate);
    const now = new Date();
    
    if (birth > now) {
      setResults(null);
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (years * 12) + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next Birthday Logic
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Day of birth
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bnDayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const birthDayName = lang === 'en' ? dayNames[birth.getDay()] : bnDayNames[birth.getDay()];

    setResults({
      years, months, days,
      totalMonths, totalWeeks, totalDays, totalHours, totalMinutes,
      daysToNextBirthday,
      birthDayName,
      isBirthday: months === 0 && days === 0
    });
  };

  useEffect(() => {
    calculateAge();
  }, [birthDate, lang]);

  const handleShare = () => {
    const text = `I am ${results.years} years, ${results.months} months, and ${results.days} days old! Calculated on CalcMate.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-rose-600 rounded-2xl text-white shadow-xl shadow-rose-100">
            <Calendar size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Pro Age Calculator' : 'প্রো বয়স ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Star size={14} className="text-amber-500" /> 
              {lang === 'en' ? 'Accurate age in years, months, days & seconds' : 'বছর, মাস, দিন এবং সেকেন্ডে নিখুঁত বয়স জানুন'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
            <div className="group">
              <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">
                {lang === 'en' ? 'Select Date of Birth' : 'জন্ম তারিখ নির্বাচন করুন'}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-rose-500 focus:bg-white font-bold text-xl text-slate-800 transition-all"
              />
            </div>

            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
              <h4 className="font-black text-rose-900 text-sm mb-2 uppercase flex items-center gap-2">
                <Gift size={16} /> {lang === 'en' ? 'Your Birth Day' : 'আপনি জন্মেছিলেন'}
              </h4>
              <p className="text-2xl font-black text-rose-600">{results?.birthDayName || '...'}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Heart size={100} fill="currentColor" />
             </div>
             <h3 className="font-black text-lg mb-4 flex items-center gap-2">
               <Clock size={18} className="text-rose-400" /> {lang === 'en' ? 'Next Birthday' : 'পরবর্তী জন্মদিন'}
             </h3>
             <div className="text-4xl font-black text-white mb-2">
               {results?.daysToNextBirthday} {lang === 'en' ? 'Days' : 'দিন'}
             </div>
             <p className="text-slate-400 text-sm font-medium">{lang === 'en' ? 'Left until your next celebration!' : 'আপনার পরবর্তী জন্মদিনের বাকি আছে'}</p>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          {results && (
            <>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 text-center relative overflow-hidden">
                {results.isBirthday && (
                   <div className="absolute inset-0 bg-rose-600/10 animate-pulse pointer-events-none"></div>
                )}
                
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">{lang === 'en' ? 'Current Age' : 'আপনার বর্তমান বয়স'}</h3>
                
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                  <div className="text-center">
                    <p className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">{results.years}</p>
                    <p className="text-xs font-black text-slate-400 uppercase mt-2">{lang === 'en' ? 'Years' : 'বছর'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">{results.months}</p>
                    <p className="text-xs font-black text-slate-400 uppercase mt-2">{lang === 'en' ? 'Months' : 'মাস'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">{results.days}</p>
                    <p className="text-xs font-black text-slate-400 uppercase mt-2">{lang === 'en' ? 'Days' : 'দিন'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{lang === 'en' ? 'Months' : 'মাস'}</p>
                    <p className="font-black text-slate-800">{results.totalMonths.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{lang === 'en' ? 'Weeks' : 'সপ্তাহ'}</p>
                    <p className="font-black text-slate-800">{results.totalWeeks.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{lang === 'en' ? 'Days' : 'দিন'}</p>
                    <p className="font-black text-slate-800">{results.totalDays.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{lang === 'en' ? 'Hours' : 'ঘণ্টা'}</p>
                    <p className="font-black text-slate-800">{results.totalHours.toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={handleShare}
                  className="w-full mt-10 py-5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-100 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                  {copied ? (lang === 'en' ? 'COPIED RESULT' : 'কপি হয়েছে') : (lang === 'en' ? 'SHARE MY AGE' : 'বয়স শেয়ার করুন')}
                </button>
              </div>

              <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                 <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                    <Star size={20} />
                 </div>
                 <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                   {lang === 'en' ? 'Pro Tip: Your chronological age is just a number. Stay healthy and keep calculating life with joy!' : 'প্রো টিপ: বয়স কেবল একটি সংখ্যা মাত্র। সুস্থ থাকুন এবং হাসিখুশি জীবন যাপন করুন!'}
                 </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;