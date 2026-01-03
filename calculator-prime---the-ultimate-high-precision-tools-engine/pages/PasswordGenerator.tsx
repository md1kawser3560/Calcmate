import React, { useState, useEffect } from 'react';
// Replaced ShieldLock with ShieldCheck and cleaned up imports
import { ShieldCheck, RefreshCcw, Copy, Check, ShieldAlert, Key, Zap, Type, Hash } from 'lucide-react';
import { useLanguage } from '../App';

const PasswordGenerator = () => {
  const { lang, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ label: '', color: '', percent: 0 });

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-';
    
    let characters = '';
    if (includeUpper) characters += upper;
    if (includeLower) characters += lower;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (!characters) return;

    let generatedPassword = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generatedPassword += characters.charAt(array[i] % characters.length);
    }

    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 12) score += 2;
    if (pass.length > 16) score += 2;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 2;
    if (/[^A-Za-z0-9]/.test(pass)) score += 2;

    if (score <= 4) setStrength({ label: lang === 'en' ? 'Weak' : 'দুর্বল', color: 'bg-rose-500', percent: 25 });
    else if (score <= 6) setStrength({ label: lang === 'en' ? 'Medium' : 'মাঝারি', color: 'bg-amber-500', percent: 50 });
    else if (score <= 8) setStrength({ label: lang === 'en' ? 'Strong' : 'শক্তিশালী', color: 'bg-emerald-500', percent: 80 });
    else setStrength({ label: lang === 'en' ? 'Excellent' : 'চমৎকার', color: 'bg-indigo-600', percent: 100 });
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Secure Password Generator' : 'নিরাপদ পাসওয়ার্ড জেনারেটর'}
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            {lang === 'en' ? 'Create highly secure passwords with cryptographic randomness.' : 'ক্রিপ্টোগ্রাফিক র‍্যান্ডমনেস দিয়ে অত্যন্ত শক্তিশালী পাসওয়ার্ড তৈরি করুন।'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-8">
           {/* Output Display */}
           <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-100/30 border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
                 <div className={`h-full ${strength.color} transition-all duration-500`} style={{ width: `${strength.percent}%` }}></div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                 <div className={`w-2 h-2 rounded-full ${strength.color} animate-pulse`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{strength.label} Password</span>
              </div>

              <div className="w-full relative px-6 mb-8">
                <input 
                  type="text" 
                  readOnly 
                  value={password}
                  className="w-full bg-transparent text-center text-3xl md:text-4xl font-black text-slate-800 break-all outline-none"
                />
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                <button 
                  onClick={generatePassword}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RefreshCcw size={18} /> {lang === 'en' ? 'Re-generate' : 'পুনরায় তৈরি'}
                </button>
                <button 
                  onClick={handleCopy}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                    copied ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? (lang === 'en' ? 'Copied' : 'কপি হয়েছে') : (lang === 'en' ? 'Copy Securely' : 'সুরক্ষিত কপি')}
                </button>
              </div>
           </div>

           {/* Configuration */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="group">
                <div className="flex justify-between items-center mb-6">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Password Length' : 'পাসওয়ার্ডের দৈর্ঘ্য'}</label>
                   <span className="text-2xl font-black text-indigo-600">{length}</span>
                </div>
                <input 
                  type="range" 
                  min="8" 
                  max="64" 
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { id: 'upper', label: lang === 'en' ? 'Uppercase (A-Z)' : 'বড় হাতের অক্ষর', state: includeUpper, set: setIncludeUpper, icon: Type },
                   { id: 'lower', label: lang === 'en' ? 'Lowercase (a-z)' : 'ছোট হাতের অক্ষর', state: includeLower, set: setIncludeLower, icon: Type },
                   { id: 'num', label: lang === 'en' ? 'Numbers (0-9)' : 'সংখ্যা', state: includeNumbers, set: setIncludeNumbers, icon: Hash },
                   { id: 'sym', label: lang === 'en' ? 'Symbols (!@#$)' : 'স্পেশাল ক্যারেক্টার', state: includeSymbols, set: setIncludeSymbols, icon: Zap },
                 ].map(item => (
                   <button 
                    key={item.id}
                    onClick={() => item.set(!item.state)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      item.state ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-400'
                    }`}
                   >
                     <div className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span className="font-bold text-sm">{item.label}</span>
                     </div>
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${item.state ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>
                        {item.state && <Check size={14} />}
                     </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Key size={100} fill="currentColor" />
              </div>
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" /> Tips for Safety
              </h3>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                 <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1"></div>
                   {lang === 'en' ? 'Never reuse the same password for multiple sensitive accounts.' : 'কখনও একাধিক সেনসিটিভ অ্যাকাউন্টে একই পাসওয়ার্ড ব্যবহার করবেন না।'}
                 </li>
                 <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1"></div>
                   {lang === 'en' ? 'Use at least 12-16 characters for critical logins like banking.' : 'ব্যাংকিং বা গুরুত্বপূর্ণ লগইনের জন্য অন্তত ১২-১৬ ক্যারেক্টার ব্যবহার করুন।'}
                 </li>
                 <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1"></div>
                   {lang === 'en' ? 'Change your important passwords every few months for better security.' : 'নিরাপত্তার স্বার্থে প্রতি কয়েক মাস অন্তর গুরুত্বপূর্ণ পাসওয়ার্ড পরিবর্তন করুন।'}
                 </li>
              </ul>
           </div>

           <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600">
                <ShieldAlert size={20} />
              </div>
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                {lang === 'en' ? 'Warning: We do not store any generated passwords. Please make sure to save it in your password manager immediately.' : 'সতর্কবাণী: আমরা কোনো পাসওয়ার্ড সংরক্ষণ করি না। পাসওয়ার্ডটি তৈরি করার সাথে সাথে নিরাপদ কোথাও সেভ করে রাখুন।'}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;