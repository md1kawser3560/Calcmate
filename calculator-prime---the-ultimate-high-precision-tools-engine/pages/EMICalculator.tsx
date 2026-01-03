
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, Share2, Check, Settings2, Lightbulb, ArrowRight, Printer, Table as TableIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../App';
import { Link } from 'react-router-dom';

const currencies = [
  { symbol: '৳', label: 'BDT (Taka)' },
  { symbol: '$', label: 'USD (Dollar)' },
  { symbol: '€', label: 'EUR (Euro)' },
  { symbol: '£', label: 'GBP (Pound)' },
  { symbol: '₹', label: 'INR (Rupee)' },
  { symbol: '¥', label: 'JPY (Yen)' },
  { symbol: 'AED', label: 'AED (Dirham)' },
  { symbol: 'SAR', label: 'SAR (Riyal)' },
];

interface ScheduleItem {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

const EMICalculator = () => {
  const [amount, setAmount] = useState<number>(500000);
  const [rate, setRate] = useState<number>(9);
  const [years, setYears] = useState<number>(2);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [shared, setShared] = useState(false);
  
  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('emi_currency') || '৳';
    }
    return '৳';
  });
  
  const { lang, t } = useLanguage();

  useEffect(() => {
    localStorage.setItem('emi_currency', currency);
  }, [currency]);

  useEffect(() => {
    const calculateEMI = () => {
      const principal = amount;
      const r = rate / 12 / 100;
      const n = years * 12;

      if (principal > 0 && rate > 0 && years > 0) {
        const emiValue = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPay = emiValue * n;
        const totInt = totalPay - principal;

        setEmi(Math.round(emiValue));
        setTotalPayment(Math.round(totalPay));
        setTotalInterest(Math.round(totInt));

        // Generate Amortization Schedule
        const scheduleData: ScheduleItem[] = [];
        let remainingBalance = principal;
        
        for (let i = 1; i <= n; i++) {
          const interestPart = remainingBalance * r;
          const principalPart = emiValue - interestPart;
          remainingBalance = Math.max(0, remainingBalance - principalPart);
          
          scheduleData.push({
            month: i,
            principal: Math.round(principalPart),
            interest: Math.round(interestPart),
            balance: Math.round(remainingBalance)
          });
        }
        setSchedule(scheduleData);
      }
    };
    calculateEMI();
  }, [amount, rate, years]);

  const formatCurrency = (value: number) => {
    const locale = ['৳', '₹'].includes(currency) ? 'en-IN' : 'en-US';
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  };

  const handleShare = async () => {
    const appUrl = window.location.href;
    const shareText = lang === 'en' 
      ? `📈 EMI Calculation Details:\n\n- Loan Amount: ${currency} ${formatCurrency(amount)}\n- Interest Rate: ${rate}%\n- Tenure: ${years} Years\n\n💰 Monthly EMI: ${currency} ${formatCurrency(emi)}\n🔴 Total Interest: ${currency} ${formatCurrency(totalInterest)}\n✅ Total Payment: ${currency} ${formatCurrency(totalPayment)}\n\nCalculated via Calculator Prime: ${appUrl}`
      : `📈 ইএমআই হিসাবের বিস্তারিত:\n\n- লোনের পরিমাণ: ${currency} ${formatCurrency(amount)}\n- সুদের হার: ${rate}%\n- মেয়াদ: ${years} বছর\n\n💰 মাসিক কিস্তি: ${currency} ${formatCurrency(emi)}\n🔴 মোট সুদ: ${currency} ${formatCurrency(totalInterest)}\n✅ মোট পরিশোধ: ${currency} ${formatCurrency(totalPayment)}\n\nক্যালকুলেটর প্রাইম অ্যাপ থেকে হিসাব করা হয়েছে: ${appUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: lang === 'en' ? 'My Loan EMI Calculation' : 'আমার লোন ইএমআই হিসাব',
          text: shareText,
          url: appUrl
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const data = [
    { name: lang === 'en' ? 'Principal' : 'আসল', value: amount },
    { name: lang === 'en' ? 'Total Interest' : 'মোট সুদ', value: totalInterest },
  ];

  const COLORS = ['#4f46e5', '#f59e0b'];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-10 px-2 no-print">
        <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
          <Calculator size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('emi_title')}</h1>
          <p className="text-slate-500 font-medium text-sm">{t('emi_sub')}</p>
        </div>
      </div>

      {/* Print-only Report Header */}
      <div className="hidden print:block mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Loan EMI Amortization Report</h1>
        <p className="text-slate-500">Generated by Calculator Prime - {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-2">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 print:border-none print:shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Settings2 size={14} />
                <span>Currency</span>
              </div>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 outline-none focus:border-indigo-500 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {currencies.map(c => (
                  <option key={c.label} value={c.symbol}>{c.symbol} - {c.label}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                {lang === 'en' ? 'LOAN AMOUNT' : 'লোনের পরিমাণ'}
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none">{currency}</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-xl font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                {lang === 'en' ? 'INTEREST RATE' : 'সুদের হার'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-xl font-bold text-slate-800"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">%</span>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                {lang === 'en' ? 'LOAN TENURE' : 'লোনের মেয়াদ'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all text-xl font-bold text-slate-800"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-tighter">{lang === 'en' ? 'YEARS' : 'বছর'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm no-print">
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
              <Lightbulb size={18} className="text-amber-500" /> 
              {lang === 'en' ? 'Smart Financial Advice' : 'আর্থিক পরামর্শ'}
            </h4>
            <div className="space-y-4">
              <Link to="/blog" className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600">
                  {lang === 'en' ? 'How to reduce your monthly EMI?' : 'কিভাবে মাসিক কিস্তি কমানো যায়?'}
                </span>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative group overflow-hidden print:text-black print:from-white print:to-white print:border print:shadow-none">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 no-print"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6 no-print">
                <h3 className="text-indigo-100 font-bold uppercase tracking-widest text-sm">{lang === 'en' ? 'MONTHLY EMI' : 'মাসিক কিস্তি'}</h3>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all backdrop-blur-sm" title="Save Report">
                        <Printer size={20} />
                    </button>
                    <button onClick={handleShare} className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all backdrop-blur-sm" title="Share">
                        {shared ? <Check size={20} /> : <Share2 size={20} />}
                    </button>
                </div>
              </div>
              <h3 className="hidden print:block text-slate-400 font-bold uppercase text-xs mb-2">{lang === 'en' ? 'MONTHLY EMI' : 'মাসিক কিস্তি'}</h3>
              <p className="text-6xl md:text-7xl font-black tracking-tight">{currency} {formatCurrency(emi)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm print:shadow-none">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{lang === 'en' ? 'TOTAL INTEREST' : 'মোট সুদ'}</p>
              <p className="text-3xl font-black text-orange-500">{currency} {formatCurrency(totalInterest)}</p>
            </div>
            <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm print:shadow-none">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{lang === 'en' ? 'TOTAL PAYMENT' : 'মোট পরিশোধ'}</p>
              <p className="text-3xl font-black text-slate-800">{currency} {formatCurrency(totalPayment)}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center print:shadow-none">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={10}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} formatter={(value) => `${currency} ${formatCurrency(Number(value))}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full mt-8 no-print">
              <button 
                onClick={handleShare}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                  shared 
                    ? 'bg-emerald-500 text-white shadow-emerald-100' 
                    : 'bg-slate-900 text-white shadow-slate-200 hover:bg-indigo-600'
                }`}
              >
                {shared ? (
                  <>
                    <Check size={20} />
                    {lang === 'en' ? 'COPIED TO CLIPBOARD' : 'ক্লিপবোর্ডে কপি হয়েছে'}
                  </>
                ) : (
                  <>
                    <Share2 size={20} />
                    {lang === 'en' ? 'SHARE CALCULATION' : 'হিসাবটি শেয়ার করুন'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Section */}
      <div className="mt-12 px-2 print:mt-8">
        <div 
          onClick={() => setShowSchedule(!showSchedule)}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer group hover:border-indigo-100 transition-all no-print"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <TableIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{lang === 'en' ? 'Monthly Amortization Schedule' : 'মাসিক অ্যামোর্টাইজেশন শিডিউল'}</h3>
              <p className="text-sm text-slate-500">{lang === 'en' ? 'View month-by-month principal and interest breakdown' : 'প্রতি মাসের আসল এবং সুদের বিস্তারিত হিসাব দেখুন'}</p>
            </div>
          </div>
          {showSchedule ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
        </div>

        {/* Schedule Table */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showSchedule ? 'max-h-[5000px] mt-6 opacity-100' : 'max-h-0 opacity-0'} print:max-h-none print:opacity-100 print:mt-8`}>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Month' : 'মাস'}</th>
                    <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Principal' : 'আসল'}</th>
                    <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Interest' : 'সুদ'}</th>
                    <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{lang === 'en' ? 'Remaining Balance' : 'অবশিষ্ট ঋণ'}</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item) => (
                    <tr key={item.month} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-600">
                        {lang === 'en' ? 'Month' : 'মাস'} {item.month}
                        {item.month % 12 === 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded uppercase">
                            {lang === 'en' ? 'Year' : 'বছর'} {item.month / 12}
                          </span>
                        )}
                      </td>
                      <td className="p-5 font-medium text-slate-800">{currency} {formatCurrency(item.principal)}</td>
                      <td className="p-5 font-medium text-orange-600">{currency} {formatCurrency(item.interest)}</td>
                      <td className="p-5 font-black text-slate-900">{currency} {formatCurrency(item.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 text-center text-slate-400 text-xs font-bold uppercase tracking-widest no-print">
              {lang === 'en' ? 'End of Schedule' : 'শিডিউল সমাপ্ত'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
