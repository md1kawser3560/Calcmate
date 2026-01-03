import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Home, Calculator, Share2, Check, Settings2, Building, CircleDollarSign, Percent } from 'lucide-react';
import { useLanguage } from '../App';

const currencies = [
  { symbol: '$', label: 'USD (Dollar)' },
  { symbol: '€', label: 'EUR (Euro)' },
  { symbol: '£', label: 'GBP (Pound)' },
  { symbol: '৳', label: 'BDT (Taka)' },
  { symbol: '₹', label: 'INR (Rupee)' },
  { symbol: '¥', label: 'JPY (Yen)' },
];

const MortgageCalculator = () => {
  const [homeValue, setHomeValue] = useState<number>(350000);
  const [downPayment, setDownPayment] = useState<number>(70000);
  const [rate, setRate] = useState<number>(6.5);
  const [years, setYears] = useState<number>(30);
  const [propertyTax, setPropertyTax] = useState<number>(2400); // Yearly
  const [insurance, setInsurance] = useState<number>(1000); // Yearly
  const [hoa, setHoa] = useState<number>(0); // Monthly
  
  const [monthlyPI, setMonthlyPI] = useState<number>(0);
  const [totalMonthly, setTotalMonthly] = useState<number>(0);
  const [shared, setShared] = useState(false);
  
  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mortgage_currency') || '$';
    }
    return '$';
  });

  const { lang, t } = useLanguage();

  useEffect(() => {
    localStorage.setItem('mortgage_currency', currency);
  }, [currency]);

  useEffect(() => {
    const principal = homeValue - downPayment;
    const r = rate / 100 / 12;
    const n = years * 12;

    let pi = 0;
    if (principal > 0 && r > 0 && n > 0) {
      pi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (principal > 0 && r === 0) {
        pi = principal / n;
    }

    const monthlyTax = propertyTax / 12;
    const monthlyIns = insurance / 12;
    
    setMonthlyPI(pi);
    setTotalMonthly(pi + monthlyTax + monthlyIns + hoa);

  }, [homeValue, downPayment, rate, years, propertyTax, insurance, hoa]);

  const formatCurrency = (value: number) => {
    const locale = ['৳', '₹'].includes(currency) ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  };

  const handleShare = async () => {
    const appUrl = window.location.href;
    const shareText = `🏡 Mortgage Calculation:\n\nHome Price: ${currency}${formatCurrency(homeValue)}\nLoan Amount: ${currency}${formatCurrency(homeValue - downPayment)}\nInterest: ${rate}%\n\n💰 Monthly Payment: ${currency}${formatCurrency(totalMonthly)}\n\nCalculated via CalcMate: ${appUrl}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mortgage Estimate',
          text: shareText,
          url: appUrl
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error(err);
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const monthlyTax = propertyTax / 12;
  const monthlyIns = insurance / 12;

  const data = [
    { name: lang === 'en' ? 'Principal & Interest' : 'আসল ও সুদ', value: monthlyPI },
    { name: lang === 'en' ? 'Property Tax' : 'সম্পত্তি কর', value: monthlyTax },
    { name: lang === 'en' ? 'Home Insurance' : 'হোম ইন্স্যুরেন্স', value: monthlyIns },
    { name: lang === 'en' ? 'HOA Fees' : 'HOA ফি', value: hoa },
  ].filter(d => d.value > 0);

  const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
          <Home size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('mortgage_title')}</h1>
          <p className="text-slate-500 font-medium text-sm">{t('mortgage_sub')}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-2">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Settings2 size={14} />
                <span>Currency</span>
              </div>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 outline-none focus:border-blue-500 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {currencies.map(c => (
                  <option key={c.label} value={c.symbol}>{c.symbol} - {c.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{lang === 'en' ? 'Home Price' : 'বাড়ির মূল্য'}</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                        <input
                        type="number"
                        value={homeValue}
                        onChange={(e) => setHomeValue(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800"
                        />
                    </div>
                </div>

                <div className="group md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest flex justify-between">
                        <span>{lang === 'en' ? 'Down Payment' : 'ডাউন পেমেন্ট'}</span>
                        <span className="text-blue-600">({Math.round((downPayment / homeValue) * 100)}%)</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency}</span>
                        <input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{lang === 'en' ? 'Interest Rate' : 'সুদের হার'}</label>
                    <div className="relative">
                        <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{lang === 'en' ? 'Loan Term' : 'লোনের মেয়াদ'}</label>
                    <div className="relative">
                        <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">{lang === 'en' ? 'Years' : 'বছর'}</span>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-4">
                    <Building size={16} className="text-slate-400"/>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{lang === 'en' ? 'Taxes & Fees' : 'ট্যাক্স এবং ফি'}</span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-600 w-1/2">{lang === 'en' ? 'Property Tax / Year' : 'সম্পত্তি কর / বছর'}</label>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{currency}</span>
                            <input
                                type="number"
                                value={propertyTax}
                                onChange={(e) => setPropertyTax(Number(e.target.value))}
                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-600 w-1/2">{lang === 'en' ? 'Home Insurance / Year' : 'হোম ইন্স্যুরেন্স / বছর'}</label>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{currency}</span>
                            <input
                                type="number"
                                value={insurance}
                                onChange={(e) => setInsurance(Number(e.target.value))}
                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-slate-600 w-1/2">{lang === 'en' ? 'HOA Fees / Month' : 'HOA ফি / মাস'}</label>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">{currency}</span>
                            <input
                                type="number"
                                value={hoa}
                                onChange={(e) => setHoa(Number(e.target.value))}
                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">{lang === 'en' ? 'ESTIMATED MONTHLY PAYMENT' : 'আনুমানিক মাসিক পেমেন্ট'}</h3>
              <div className="flex flex-col md:flex-row md:items-end gap-2 mb-6">
                 <p className="text-5xl md:text-7xl font-black tracking-tight">{currency} {formatCurrency(totalMonthly)}</p>
                 <p className="text-slate-400 font-medium pb-2">/ {lang === 'en' ? 'month' : 'মাস'}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-300">
                 <div className="px-4 py-2 bg-white/10 rounded-xl">
                    <span className="block text-[10px] uppercase text-slate-400 font-bold">Loan Amount</span>
                    <span className="text-white font-bold text-lg">{currency} {formatCurrency(homeValue - downPayment)}</span>
                 </div>
                 <div className="px-4 py-2 bg-white/10 rounded-xl">
                    <span className="block text-[10px] uppercase text-slate-400 font-bold">Total Interest</span>
                    <span className="text-white font-bold text-lg">{currency} {formatCurrency((monthlyPI * years * 12) - (homeValue - downPayment))}</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <h4 className="font-bold text-slate-800 mb-6 w-full text-left">{lang === 'en' ? 'Payment Breakdown' : 'পেমেন্টের বিস্তারিত'}</h4>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* Fixed: cornerRadius belongs to Pie, not Cell */}
                  <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={10}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} formatter={(value) => `${currency} ${formatCurrency(Number(value))}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full mt-6">
              <button 
                onClick={handleShare}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  shared 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {shared ? <Check size={18} /> : <Share2 size={18} />}
                {shared ? (lang === 'en' ? 'Copied' : 'কপি হয়েছে') : (lang === 'en' ? 'Share Estimate' : 'শেয়ার করুন')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;