import React, { useState, useEffect } from 'react';
import { PiggyBank, Info, Calculator, Percent, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../App';

const SanchaypatraCalculator = () => {
  const [investment, setInvestment] = useState<number>(100000);
  const [type, setType] = useState('paribar'); // paribar, pension, quaterly
  const [monthlyProfit, setMonthlyProfit] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const { lang, t } = useLanguage();

  useEffect(() => {
    calculateProfit();
  }, [investment, type]);

  const calculateProfit = () => {
    let rate = 11.52; // Default for Paribar Sanchaypatra
    
    // Tiered Logic (Simplified BD Rules)
    if (investment > 3000000) rate = 10.0;
    else if (investment > 1500000) rate = 10.5;

    let annualProfit = (investment * rate) / 100;
    let monthly = annualProfit / 12;
    
    // Tax: 5% up to 5 Lakh, 10% above (approx simplified)
    let taxRate = investment > 500000 ? 0.10 : 0.05;
    let tax = monthly * taxRate;

    setMonthlyProfit(Math.round(monthly));
    setTaxAmount(Math.round(tax));
    setNetProfit(Math.round(monthly - tax));
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm">
          <PiggyBank size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('sanchay_calc')}</h1>
          <p className="text-slate-500 font-medium text-sm">
            {lang === 'en' ? 'Calculate your monthly income from Savings Certificates.' : 'সঞ্চয়পত্র থেকে আপনার মাসিক মুনাফার পরিমাণ হিসাব করুন।'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
            <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">{lang === 'en' ? 'Investment Amount' : 'বিনিয়োগের পরিমাণ'}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                    <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 focus:bg-white font-bold text-2xl text-slate-800"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">{lang === 'en' ? 'Scheme Type' : 'সঞ্চয়পত্রের ধরন'}</label>
                <div className="grid grid-cols-1 gap-2">
                    {[
                        { id: 'paribar', label: lang === 'en' ? 'Family (পরিবার)' : 'পরিবার সঞ্চয়পত্র' },
                        { id: 'pension', label: lang === 'en' ? 'Pensioner (পেনশনার)' : 'পেনশনার সঞ্চয়পত্র' },
                        { id: 'quaterly', label: lang === 'en' ? '3-Month Profit (৩ মাস অন্তর)' : '৩ মাস অন্তর মুনাফাভিত্তিক' },
                    ].map(s => (
                        <button
                            key={s.id}
                            onClick={() => setType(s.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${
                                type === s.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {s.label}
                            {type === s.id && <ShieldCheck size={18} />}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-[2rem] text-white">
             <h4 className="font-bold mb-4 flex items-center gap-2"><Percent size={18} /> {lang === 'en' ? 'Rules & Tax' : 'নিয়ম ও ট্যাক্স'}</h4>
             <ul className="space-y-3 text-sm text-emerald-100">
                <li className="flex gap-2"><span>•</span> {lang === 'en' ? '5% Tax for investment up to 5 Lakh BDT.' : '৫ লক্ষ টাকা পর্যন্ত বিনিয়োগে ৫% ট্যাক্স কাটা হয়।'}</li>
                <li className="flex gap-2"><span>•</span> {lang === 'en' ? '10% Tax for investment above 5 Lakh BDT.' : '৫ লক্ষ টাকার উপরে বিনিয়োগে ১০% ট্যাক্স প্রযোজ্য।'}</li>
                <li className="flex gap-2"><span>•</span> {lang === 'en' ? 'Profit rates drop if investment exceeds 15 or 30 Lakh.' : '১৫ বা ৩০ লক্ষ টাকার বেশি বিনিয়োগে মুনাফার হার কমে যায়।'}</li>
             </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100">
             <h3 className="text-emerald-100 font-bold uppercase tracking-widest text-xs mb-4">
                {lang === 'en' ? 'Monthly Net Profit' : 'মাসিক নিট মুনাফা (হাতে পাবেন)'}
             </h3>
             <div className="text-6xl font-black mb-4">৳ {netProfit.toLocaleString()}</div>
             <div className="flex justify-between pt-6 border-t border-white/10 text-emerald-50">
                <div className="text-center">
                    <div className="text-[10px] uppercase font-bold opacity-60">Monthly Gross</div>
                    <div className="font-bold">৳ {monthlyProfit.toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] uppercase font-bold opacity-60">Tax Deducted</div>
                    <div className="font-bold">৳ {taxAmount.toLocaleString()}</div>
                </div>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Info size={18} className="text-slate-400" /> {lang === 'en' ? 'Investment Summary' : 'বিনিয়োগের সারাংশ'}
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? 'Annual Profit' : 'বার্ষিক মুনাফা'}</span>
                    <span className="font-bold text-slate-800">৳ {(netProfit * 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                    <span className="text-slate-500">{lang === 'en' ? '5-Year Total' : '৫ বছরের মোট মুনাফা'}</span>
                    <span className="font-bold text-slate-800">৳ {(netProfit * 60).toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanchaypatraCalculator;