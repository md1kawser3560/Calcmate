import React, { useState, useEffect } from 'react';
import { Type, Copy, Check, Languages, X, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../App';

// ... (keep bnWords array and CaseType type exactly as is)
const bnWords = [
  "শূন্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়",
  "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোল", "সতেরো", "আঠারো", "উনিশ",
  "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আঠাশ", "ঊনত্রিশ",
  "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁয়ত্রিশ", "আটত্রিশ", "ঊনচল্লিশ",
  "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ",
  "পঞ্চাশ", "একপঞ্চাশ", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট",
  "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর",
  "সত্তর", "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি",
  "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই",
  "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"
];

type CaseType = 'default' | 'upper' | 'lower' | 'title';

const NumberToWords = () => {
  const [number, setNumber] = useState<string>('');
  const [words, setWords] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Use global language context for UI strings, but keep local state for output target language if needed.
  // Ideally, the output language should probably match the UI language for a seamless experience.
  const { lang: globalLang, t } = useLanguage();
  const [targetLang, setTargetLang] = useState<'en' | 'bn'>('bn');
  
  // Sync target language with global language on mount/change, but allow user to toggle manually if they want.
  useEffect(() => {
    setTargetLang(globalLang);
  }, [globalLang]);

  const [textCase, setTextCase] = useState<CaseType>('default');
  
  // Initialize theme from localStorage if available
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('n2w_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('n2w_theme', newTheme);
      return newTheme;
    });
  };

  // Helper to parse both English and Bangla digits safely
  const parseNumber = (str: string): number => {
    if (!str) return NaN;
    // 1. Replace Bangla digits with English digits
    const engStr = str.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
    // 2. Remove commas and spaces (formatting characters)
    const cleanStr = engStr.replace(/[, ]/g, '');
    
    // Ensure there is at least one digit to parse
    if (!/\d/.test(cleanStr)) return NaN;

    // 3. Parse integer (parseInt stops at decimal point)
    const num = parseInt(cleanStr, 10);
    return num;
  };

  // Bangla Number to Words Conversion Logic
  const convertToBangla = (n: number): string => {
    if (isNaN(n)) return "";
    if (n < 0) return "ঋণাত্মক " + convertToBangla(Math.abs(n));
    if (n < 100) return bnWords[n];
    
    let str = "";
    
    // Crore (1,00,00,000)
    if (n >= 10000000) {
      const crore = Math.floor(n / 10000000);
      n = n % 10000000;
      str += convertToBangla(crore) + " কোটি ";
    }
    // Lakh (1,00,000)
    if (n >= 100000) {
      const lakh = Math.floor(n / 100000);
      n = n % 100000;
      str += convertToBangla(lakh) + " লক্ষ ";
    }
    // Thousand (1,000)
    if (n >= 1000) {
      const thousand = Math.floor(n / 1000);
      n = n % 1000;
      str += convertToBangla(thousand) + " হাজার ";
    }
    // Hundred (100)
    if (n >= 100) {
      const hundred = Math.floor(n / 100);
      n = n % 100;
      str += convertToBangla(hundred) + " শত ";
    }
    // Remaining part (< 100)
    if (n > 0) {
      str += bnWords[n];
    }
    
    return str.trim();
  };

  const convertToEnglish = (n: number) => {
    if (isNaN(n)) return "";
    if (n === 0) return 'Zero';

    const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

    const getLT20 = (n: number) => a[n];
    const getTens = (n: number) => b[Math.floor(n/10)] + (n%10 !== 0 ? '-' + a[n%10] : '');

    function numToEnglish(n: number): string {
        if (n < 20) return getLT20(n);
        if (n < 100) return getTens(n);
        if (n < 1000) return getLT20(Math.floor(n/100)) + 'Hundred ' + (n%100 !== 0 ? 'and ' + numToEnglish(n%100) : '');
        if (n < 1000000) return numToEnglish(Math.floor(n/1000)) + 'Thousand ' + (n%1000 !== 0 ? numToEnglish(n%1000) : '');
        if (n < 1000000000) return numToEnglish(Math.floor(n/1000000)) + 'Million ' + (n%1000000 !== 0 ? numToEnglish(n%1000000) : '');
        if (n < 1000000000000) return numToEnglish(Math.floor(n/1000000000)) + 'Billion ' + (n%1000000000 !== 0 ? numToEnglish(n%1000000000) : '');
        return 'Number too large';
    }

    return numToEnglish(n).trim();
  };

  useEffect(() => {
    if (!number) {
      setWords('');
      return;
    }

    const num = parseNumber(number);
    
    if (isNaN(num)) {
      setWords('');
      return;
    }
    
    if (num === 0) {
      setWords(targetLang === 'bn' ? 'শূন্য' : 'Zero');
      return;
    }

    if (targetLang === 'bn') {
      setWords(convertToBangla(num));
    } else {
      setWords(convertToEnglish(num));
    }
  }, [number, targetLang]);

  const getFormattedWords = () => {
    if (targetLang === 'bn' || !words) return words;

    switch (textCase) {
      case 'upper':
        return words.toUpperCase();
      case 'lower':
        return words.toLowerCase();
      case 'title':
        return words.toLowerCase().replace(/(?:^|\s|-)\S/g, (a) => a.toUpperCase());
      default:
        return words;
    }
  };

  const displayWords = getFormattedWords();

  const handleCopy = () => {
    if(displayWords) {
      navigator.clipboard.writeText(displayWords);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <Type size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('n2w_title')}</h1>
            <p className="text-slate-500">{t('n2w_sub')}</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl transition-all ${
            isDark 
              ? 'bg-slate-800 text-yellow-400 shadow-sm border border-slate-700' 
              : 'bg-white text-slate-400 hover:text-orange-500 shadow-sm border border-slate-100'
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className={`p-8 rounded-2xl shadow-sm border transition-colors duration-300 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
      }`}>
        
        {/* Language Toggle */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Languages size={16} />
            <span>{t('words_lang')}</span>
          </div>
          <div className={`p-1 rounded-lg flex items-center transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <button
              onClick={() => { setTargetLang('bn'); setTextCase('default'); }}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                targetLang === 'bn' 
                  ? (isDark ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setTargetLang('en')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                targetLang === 'en' 
                  ? (isDark ? 'bg-slate-600 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="mb-6 relative">
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {t('enter_num')} {targetLang === 'bn' ? '(English or Bangla digits)' : '(English digits)'}
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={`w-full p-4 text-xl rounded-xl border outline-none font-medium pr-12 transition-colors focus:ring-2 focus:ring-indigo-500 ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600 focus:border-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
              placeholder={targetLang === 'bn' ? "১২৩৪৫" : "12345"}
            />
            {number && (
              <button 
                onClick={() => setNumber('')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${
                  isDark 
                    ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' 
                    : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                }`}
                title="Clear"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className={`rounded-xl p-6 border relative group min-h-[140px] flex flex-col transition-colors ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
            <p className={`text-sm font-bold uppercase tracking-wider py-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {t('in_words')} ({targetLang === 'bn' ? 'Bangla' : 'English'})
            </p>
            
            <div className="flex items-center gap-2 ml-auto">
              {targetLang === 'en' && words && (
                <div className={`flex rounded-lg border p-1 shadow-sm transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                  <button 
                    onClick={() => setTextCase('lower')}
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      textCase === 'lower' 
                        ? (isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700') 
                        : (isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50')
                    }`}
                    title="Lowercase"
                  >
                    abc
                  </button>
                  <button 
                    onClick={() => setTextCase('title')}
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      textCase === 'title' || textCase === 'default' 
                        ? (isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700') 
                        : (isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50')
                    }`}
                    title="Title Case"
                  >
                    Abc
                  </button>
                  <button 
                    onClick={() => setTextCase('upper')}
                    className={`px-2 py-1 text-xs font-bold rounded ${
                      textCase === 'upper' 
                        ? (isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700') 
                        : (isDark ? 'text-slate-500 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50')
                    }`}
                    title="Uppercase"
                  >
                    ABC
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <p className={`text-2xl leading-relaxed transition-all duration-200 break-words w-full ${
              targetLang === 'en' ? 'font-serif italic' : 'font-sans font-medium'
            } ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {displayWords || <span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} not-italic font-normal`}>...</span>}
            </p>

            {words && (
                <button 
                  onClick={handleCopy}
                  className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg transition-colors border text-sm font-bold uppercase tracking-wider ${
                    copied 
                      ? (isDark ? 'text-green-400 bg-green-900/30 border-green-800' : 'text-green-700 bg-green-100 border-green-200')
                      : (isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700 border-transparent hover:border-slate-600' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200/50 hover:border-indigo-100')
                  }`}
                  title={t('copy')}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? t('copied') : t('copy')}</span>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberToWords;