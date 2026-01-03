import React, { useState, useEffect } from 'react';
import { RefreshCcw, ArrowRightLeft, Globe, DollarSign, TrendingUp, Search, Check, Copy, Info } from 'lucide-react';
import { useLanguage } from '../App';
import { GoogleGenAI } from "@google/genai";

const popularCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'us' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: 'gb' },
  { code: 'BDT', name: 'Bangla Taka', symbol: '৳', flag: 'bd' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: 'in' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'DH', flag: 'ae' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: 'sa' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'ca' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'au' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'sg' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: 'jp' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: 'cn' },
];

const CurrencyConverter = () => {
  const { lang, t } = useLanguage();
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState(popularCurrencies[0]);
  const [toCurrency, setToCurrency] = useState(popularCurrencies[3]); // Default to BDT
  const [exchangeRate, setExchangeRate] = useState<number>(121.5); // Default mock
  const [isFetching, setIsFetching] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchLiveRate = async () => {
    setIsFetching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `What is the current live exchange rate for 1 ${fromCurrency.code} to ${toCurrency.code}? Return ONLY the numerical value as a float. Use Google Search for the most recent data.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const rateText = response.text;
      const rateMatch = rateText.match(/\d+(?:\.\d+)?/);
      if (rateMatch) {
        setExchangeRate(parseFloat(rateMatch[0]));
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLiveRate();
  }, [fromCurrency, toCurrency]);

  const convertedAmount = amount * exchangeRate;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleCopy = () => {
    const text = `${amount} ${fromCurrency.code} = ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
            <Globe size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'en' ? 'Global Currency Converter' : 'গ্লোবাল কারেন্সি কনভার্টার'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-green-500" /> 
              {lang === 'en' ? 'Live International Exchange Rates' : 'সরাসরি বিশ্ববাজারের বিনিময় হার'}
            </p>
          </div>
        </div>

        <button 
          onClick={fetchLiveRate}
          disabled={isFetching}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            isFetching ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          <RefreshCcw size={18} className={isFetching ? 'animate-spin' : ''} />
          {isFetching ? (lang === 'en' ? 'Updating...' : 'আপডেট হচ্ছে...') : (lang === 'en' ? 'Refresh Rates' : 'রেট রিফ্রেশ করুন')}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Main Converter Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <DollarSign size={200} />
            </div>

            <div className="relative z-10 space-y-10">
              {/* From Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {lang === 'en' ? 'Amount to Convert' : 'পরিমাণ'}
                  </label>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-indigo-500 focus:bg-white font-black text-4xl text-slate-800 transition-all"
                  />
                  <select 
                    value={fromCurrency.code}
                    onChange={(e) => setFromCurrency(popularCurrencies.find(c => c.code === e.target.value) || popularCurrencies[0])}
                    className="md:w-48 p-5 bg-white border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer text-lg"
                  >
                    {popularCurrencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-6 relative z-20">
                <button 
                  onClick={handleSwap}
                  className="p-5 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all group"
                >
                  <ArrowRightLeft size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>

              {/* To Section */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                  {lang === 'en' ? 'Converted Result' : 'ফলাফল'}
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 p-6 bg-indigo-50/50 border-2 border-indigo-100 rounded-[2.5rem] flex items-center">
                    <span className="text-4xl md:text-5xl font-black text-indigo-700 tracking-tight truncate">
                      {isFetching ? '...' : convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="ml-3 text-2xl font-bold text-indigo-300">{toCurrency.symbol}</span>
                  </div>
                  <select 
                    value={toCurrency.code}
                    onChange={(e) => setToCurrency(popularCurrencies.find(c => c.code === e.target.value) || popularCurrencies[3])}
                    className="md:w-48 p-5 bg-white border-2 border-slate-100 rounded-[2.5rem] font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer text-lg"
                  >
                    {popularCurrencies.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info & Action Bar */}
              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img src={`https://flagcdn.com/w40/${fromCurrency.flag}.png`} alt="flag" className="w-10 rounded-lg shadow-sm" />
                  <div className="text-slate-400">
                    <ArrowRightLeft size={16} className="mx-auto" />
                  </div>
                  <img src={`https://flagcdn.com/w40/${toCurrency.flag}.png`} alt="flag" className="w-10 rounded-lg shadow-sm" />
                  <div className="ml-2">
                    <p className="text-sm font-black text-slate-800">
                      1 {fromCurrency.code} = {isFetching ? '...' : exchangeRate.toFixed(4)} {toCurrency.code}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mid-market rate</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleCopy}
                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                      copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? (lang === 'en' ? 'COPIED' : 'কপি হয়েছে') : (lang === 'en' ? 'COPY RESULT' : 'কপি করুন')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Popular Rates */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <TrendingUp size={24} className="text-indigo-400" />
              {lang === 'en' ? 'Popular Pairs' : 'জনপ্রিয় বিনিময় হার'}
            </h3>
            
            <div className="space-y-5">
              {[
                { from: 'USD', to: 'BDT', flag: 'bd' },
                { from: 'EUR', to: 'USD', flag: 'us' },
                { from: 'GBP', to: 'USD', flag: 'us' },
                { from: 'USD', to: 'INR', flag: 'in' },
                { from: 'SAR', to: 'BDT', flag: 'bd' },
                { from: 'AED', to: 'BDT', flag: 'bd' },
              ].map((pair, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={`https://flagcdn.com/w20/${pair.flag}.png`} alt="flag" className="w-5 rounded shadow-sm" />
                    <span className="font-bold text-sm text-slate-300">{pair.from} / {pair.to}</span>
                  </div>
                  <span className="font-black text-indigo-400">Live Rate</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex items-start gap-3">
              <Info size={18} className="text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Rates are provided for informational purposes only. Actual bank rates may vary depending on service charges and local regulations.
              </p>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100/50">
             <h4 className="font-black text-lg mb-2 uppercase tracking-tight">Need to send money?</h4>
             <p className="text-sm text-indigo-100 mb-6 opacity-80">Check live market trends before you make international transactions to save money.</p>
             <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;