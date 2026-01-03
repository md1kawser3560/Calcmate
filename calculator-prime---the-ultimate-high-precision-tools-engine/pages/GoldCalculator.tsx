import React, { useState, useEffect } from 'react';
import { Coins, Info, Calculator, TrendingUp, RefreshCcw, Globe, DollarSign } from 'lucide-react';
import { useLanguage } from '../App';
import { GoogleGenAI } from "@google/genai";

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'BDT', symbol: '৳', name: 'BD Taka', rate: 120 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 84 },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal', rate: 3.75 },
  { code: 'AED', symbol: 'DH', name: 'UAE Dirham', rate: 3.67 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
];

const units = [
  { id: 'bhori', name: 'Bhori / Vori (ভরি)', factor: 11.664 },
  { id: 'gram', name: 'Gram (গ্রাম)', factor: 1 },
  { id: 'ounce', name: 'Ounce (Troy)', factor: 31.1035 },
  { id: 'tola', name: 'Tola', factor: 11.66 },
];

const GoldCalculator = () => {
  const [weight, setWeight] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [goldPriceUSDPerOz, setGoldPriceUSDPerOz] = useState<number>(2650); // Default market price
  const [isUpdating, setIsUpdating] = useState(false);
  const { lang, t } = useLanguage();

  // Calculate Gram Weight for internal logic
  const gramWeight = weight * selectedUnit.factor;

  // Auto-fetch logic using Gemini
  const fetchLivePrice = async () => {
    setIsUpdating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "What is the current live international spot price of gold per troy ounce in USD? Return ONLY the number.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const priceText = response.text;
      const priceMatch = priceText.match(/\d+(?:\.\d+)?/);
      if (priceMatch) {
        setGoldPriceUSDPerOz(parseFloat(priceMatch[0]));
      }
    } catch (error) {
      console.error("Failed to fetch live price", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriceByCarat = (carat: number) => {
    // 24K is the base (100%), others are proportional
    const basePerGramUSD = goldPriceUSDPerOz / 31.1035;
    const caratFactor = carat / 24;
    const priceUSD = basePerGramUSD * gramWeight * caratFactor;
    return priceUSD * selectedCurrency.rate;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency.code,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-100 rounded-2xl text-amber-600 shadow-sm">
            <Coins size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{lang === 'en' ? 'International Gold Price' : 'বিশ্ববাজারের স্বর্ণের দাম'}</h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
              <Globe size={14} /> {lang === 'en' ? 'Live Global Spot Rates' : 'সরাসরি বিশ্ববাজার দর অনুযায়ী'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={fetchLivePrice}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            isUpdating ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          <RefreshCcw size={18} className={isUpdating ? 'animate-spin' : ''} />
          {isUpdating ? (lang === 'en' ? 'Fetching...' : 'আপডেট হচ্ছে...') : (lang === 'en' ? 'Fetch Live Market Price' : 'লাইভ বাজার দর জানুন')}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">1. Select Region / Currency</label>
              <div className="grid grid-cols-2 gap-3">
                {currencies.map(curr => (
                  <button 
                    key={curr.code}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${
                      selectedCurrency.code === curr.code ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>{curr.name}</span>
                    <span className="opacity-60">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">2. Input Weight & Unit</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="flex-1 p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-amber-400 focus:bg-white font-black text-3xl text-slate-800"
                />
                <select 
                  value={selectedUnit.id}
                  onChange={(e) => setSelectedUnit(units.find(u => u.id === e.target.value) || units[1])}
                  className="w-32 p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 outline-none focus:border-indigo-500"
                >
                  {units.map(u => <option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>)}
                </select>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Live Spot Rate (USD / Oz)</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-[10px] font-black uppercase">Market Open</span>
               </div>
               <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                  <input
                    type="number"
                    value={goldPriceUSDPerOz}
                    onChange={(e) => setGoldPriceUSDPerOz(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-5 bg-slate-900 border-none rounded-2xl text-white font-black text-3xl outline-none focus:ring-4 focus:ring-indigo-500/20"
                  />
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white relative overflow-hidden group">
             <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform" />
             <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Globe size={18} className="text-indigo-400" /> Investment Guide
             </h4>
             <ul className="space-y-4 text-sm text-slate-400">
                <li>• <b>Spot Price:</b> Current market price for raw gold bars.</li>
                <li>• <b>Purity:</b> 24K is 99.9% pure, 22K is 91.6% (Standard for jewelry).</li>
                <li>• <b>Spread:</b> Buying and selling prices always differ by 3-5%.</li>
             </ul>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Market Value Breakdown</h3>
               <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  1 USD = {selectedCurrency.rate} {selectedCurrency.code}
               </div>
             </div>

             <div className="space-y-4">
                {/* 24K Result */}
                <div className="p-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] text-white shadow-xl shadow-amber-100 group transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-black text-amber-100 tracking-tighter text-lg">24 KARAT GOLD</span>
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase">Investment Grade</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-black mb-4">{formatPrice(getPriceByCarat(24))}</div>
                  <div className="text-xs opacity-70 font-bold uppercase tracking-widest">{weight} {selectedUnit.name} @ ${goldPriceUSDPerOz.toLocaleString()}/Oz</div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:border-amber-200">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">22 Karat (Jewelry)</span>
                    <div className="text-3xl font-black text-slate-800">{formatPrice(getPriceByCarat(22))}</div>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:border-amber-200">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">21 Karat (Standard)</span>
                    <div className="text-3xl font-black text-slate-800">{formatPrice(getPriceByCarat(21))}</div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:border-amber-200 flex justify-between items-center">
                   <div>
                     <span className="text-xs font-bold text-slate-400 uppercase block mb-1">18 Karat (Commercial)</span>
                     <div className="text-3xl font-black text-slate-800">{formatPrice(getPriceByCarat(18))}</div>
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Purity</span>
                     <span className="font-black text-amber-600">75.0%</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-start gap-4">
             <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-bold text-indigo-900 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-indigo-700/80 leading-relaxed">
                   The prices shown are based on international spot market rates. Retail jewelry prices in local markets (like BAJUS in BD) include VAT, import taxes, and making charges which are not included here.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldCalculator;