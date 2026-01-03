import React, { useState, useEffect } from 'react';
import { Tag, ArrowRight, RefreshCcw, Info, Share2, Check, ShoppingBag, Percent } from 'lucide-react';
import { useLanguage } from '../App';

const DiscountCalculator = () => {
  const { lang, t } = useLanguage();
  const [price, setPrice] = useState<string>('1000');
  const [discount, setDiscount] = useState<string>('20');
  const [tax, setTax] = useState<string>('0');
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Helper to parse English and Bengali digits
  const toEnglishDigits = (str: string): string => {
    return str.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString());
  };

  const cleanInput = (val: string): string => {
    const cleaned = toEnglishDigits(val).replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
  };

  const calculate = () => {
    const originalPrice = parseFloat(cleanInput(price)) || 0;
    const discountPercent = parseFloat(cleanInput(discount)) || 0;
    const taxPercent = parseFloat(cleanInput(tax)) || 0;

    const discountAmount = (originalPrice * discountPercent) / 100;
    const priceAfterDiscount = originalPrice - discountAmount;
    const taxAmount = (priceAfterDiscount * taxPercent) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;

    setResults({
      savings: discountAmount,
      subtotal: priceAfterDiscount,
      tax: taxAmount,
      total: finalPrice
    });
  };

  useEffect(() => {
    calculate();
  }, [price, discount, tax]);

  const handleCopy = () => {
    const text = `Price: ${price}, Discount: ${discount}%, Final Price: ${results?.total?.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="p-4 bg-orange-600 rounded-2xl text-white shadow-xl shadow-orange-100">
          <Tag size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Smart Discount Calculator' : 'স্মার্ট ডিসকাউন্ট ক্যালকুলেটর'}
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            {lang === 'en' ? 'Quickly calculate sales price and total savings.' : 'সহজেই বিক্রয় মূল্য এবং মোট সাশ্রয় হিসাব করুন।'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 px-2">
        {/* Input Side */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="group">
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                {lang === 'en' ? 'Original Price' : 'আসল মূল্য'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(cleanInput(e.target.value))}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white font-black text-3xl text-slate-800 transition-all leading-normal"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                {lang === 'en' ? 'Discount Percentage (%)' : 'ডিসকাউন্ট (%)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={discount}
                  onChange={(e) => setDiscount(cleanInput(e.target.value))}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white font-black text-3xl text-slate-800 transition-all leading-normal"
                  placeholder="0"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">%</span>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                {lang === 'en' ? 'Sales Tax (%)' : 'ভ্যাট বা ট্যাক্স (%)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={tax}
                  onChange={(e) => setTax(cleanInput(e.target.value))}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white font-black text-3xl text-slate-800 transition-all leading-normal"
                  placeholder="0"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <ShoppingBag size={120} />
            </div>
            
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">
              {lang === 'en' ? 'Final Summary' : 'হিসাবের সারাংশ'}
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase mb-1">{lang === 'en' ? 'You Pay' : 'আপনি দিবেন'}</p>
                   <p className="text-6xl font-black tracking-tight">{results?.total?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-emerald-400 uppercase mb-1">{lang === 'en' ? 'You Save' : 'সাশ্রয় হবে'}</p>
                   <p className="text-2xl font-black text-emerald-400">-{results?.savings?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{lang === 'en' ? 'Before Tax' : 'ট্যাক্স ছাড়া'}</p>
                    <p className="font-bold text-lg">{results?.subtotal?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{lang === 'en' ? 'Tax Amount' : 'ট্যাক্সের পরিমাণ'}</p>
                    <p className="font-bold text-lg">{results?.tax?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                 </div>
              </div>

              <button 
                onClick={handleCopy}
                className="w-full mt-4 py-5 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {copied ? <Check size={20} /> : <Share2 size={20} />}
                {copied ? (lang === 'en' ? 'Copied' : 'কপি হয়েছে') : (lang === 'en' ? 'Copy Calculation' : 'হিসাব কপি করুন')}
              </button>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-orange-600">
                <Info size={20} />
             </div>
             <p className="text-sm text-orange-700 font-medium leading-relaxed">
               {lang === 'en' ? 'Pro Tip: Always check if the tax is included in the original price or added separately at checkout.' : 'প্রো টিপস: কেনাকাটার সময় সর্বদা চেক করে নিন ভ্যাট আসল মূল্যের সাথে যুক্ত আছে নাকি আলাদাভাবে যোগ হবে।'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCalculator;