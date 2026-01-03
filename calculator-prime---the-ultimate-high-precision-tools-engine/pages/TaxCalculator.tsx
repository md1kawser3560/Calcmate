import React, { useState, useEffect } from 'react';
import { Percent, Info, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../App';
import { Link } from 'react-router-dom';

const TaxCalculator = () => {
  const [income, setIncome] = useState<number>(500000);
  const [category, setCategory] = useState('general');
  const [tax, setTax] = useState(0);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const { lang, t } = useLanguage();

  useEffect(() => {
    calculateTax();
  }, [income, category]);

  const calculateTax = () => {
    let limit = 350000;
    if (category === 'female_senior') limit = 400000;
    else if (category === 'disabled') limit = 475000;
    else if (category === 'freedom_fighter') limit = 500000;

    let remaining = income;
    let totalTax = 0;
    const history = [];

    const slot1 = Math.min(remaining, limit);
    history.push({ label: `${lang === 'bn' ? 'প্রথম স্ল্যাব' : 'First Slab'} ৳${limit.toLocaleString()} (0%)`, amount: 0, taxable: slot1 });
    remaining = Math.max(0, remaining - slot1);

    const calcSlab = (slabLimit: number, rate: number, label: string) => {
      if (remaining > 0) {
        const taxable = slabLimit === -1 ? remaining : Math.min(remaining, slabLimit);
        const taxAmount = taxable * (rate / 100);
        totalTax += taxAmount;
        history.push({ label: `${label} (${rate}%)`, amount: taxAmount, taxable: taxable });
        remaining = Math.max(0, remaining - taxable);
      }
    };

    calcSlab(100000, 5, `${lang === 'bn' ? 'পরবর্তী' : 'Next'} ৳1,00,000`);
    calcSlab(300000, 10, `${lang === 'bn' ? 'পরবর্তী' : 'Next'} ৳3,00,000`);
    calcSlab(400000, 15, `${lang === 'bn' ? 'পরবর্তী' : 'Next'} ৳4,00,000`);
    calcSlab(500000, 20, `${lang === 'bn' ? 'পরবর্তী' : 'Next'} ৳5,00,000`);
    calcSlab(-1, 25, lang === 'bn' ? 'অবশিষ্টাংশ' : 'Remaining');

    setTax(totalTax);
    setBreakdown(history);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="p-4 bg-orange-100 rounded-2xl text-orange-600 shadow-sm">
          <Percent size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('tax_title')}</h1>
          <p className="text-slate-500 font-medium text-sm">{t('tax_sub')}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-2">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-orange-600 transition-colors">
                {lang === 'en' ? 'Total Annual Income' : 'মোট বার্ষিক আয়'} (৳)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50/50 outline-none transition-all text-xl font-bold text-slate-800"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                {lang === 'en' ? 'Taxpayer Category' : 'করদাতার ধরণ'}
              </label>
              <div className="space-y-2">
                {[
                  { id: 'general', label: lang === 'en' ? 'General' : 'সাধারণ' },
                  { id: 'female_senior', label: lang === 'en' ? 'Female / 65+' : 'নারী / ৬৫+ বছর' },
                  { id: 'disabled', label: lang === 'en' ? 'Third Gender / Disabled' : 'তৃতীয় লিঙ্গ / প্রতিবন্ধী' },
                  { id: 'freedom_fighter', label: lang === 'en' ? 'Gazetted Freedom Fighter' : 'গেজেটেড মুক্তিযোদ্ধা' },
                ].map((cat) => (
                  <label 
                    key={cat.id} 
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      category === cat.id 
                        ? 'bg-orange-50/50 border-orange-200 text-orange-900 ring-4 ring-orange-50/30' 
                        : 'border-slate-50 bg-slate-50/30 text-slate-600 hover:bg-slate-50 hover:border-slate-100'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="category" 
                      value={cat.id} 
                      checked={category === cat.id} 
                      onChange={(e) => setCategory(e.target.value)} 
                      className="w-5 h-5 text-orange-600 accent-orange-600" 
                    />
                    <span className="font-bold text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
               <ShieldCheck size={18} className="text-emerald-500" /> 
               {lang === 'en' ? 'Helpful Resources' : 'প্রয়োজনীয় তথ্য'}
             </h4>
             <div className="space-y-3">
                <a href="https://etaxnbr.gov.bd/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group">
                  <span className="text-sm font-medium text-slate-600 group-hover:text-orange-600">e-Tax Return NBR (BD)</span>
                  <ExternalLink size={16} className="text-slate-300 group-hover:text-orange-600" />
                </a>
                <Link to="/blog" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 transition-colors group">
                  <span className="text-sm font-medium text-slate-600 group-hover:text-orange-600">
                    {lang === 'en' ? 'Income Tax Rules 2024-25' : 'আয়কর বিধি ২০২৪-২৫'}
                  </span>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-orange-600" />
                </Link>
             </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-orange-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h3 className="text-orange-100 font-bold uppercase tracking-widest text-xs mb-3">
                {lang === 'en' ? 'Estimated Total Tax' : 'মোট আনুমানিক কর'}
              </h3>
              <p className="text-6xl md:text-7xl font-black tracking-tight">৳ {tax.toLocaleString()}</p>
              <p className="text-sm text-orange-100 mt-4 font-medium opacity-80">
                {lang === 'en' ? 'Calculated based on standard BD tax slabs' : 'বাংলাদেশের বর্তমান আয়কর বিধি অনুযায়ী গণনাকৃত'}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Info size={20} className="text-slate-400" />
              {lang === 'en' ? 'Calculation Details' : 'হিসাবের বিস্তারিত'}
            </h3>
            <div className="space-y-4">
              {breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-50 hover:bg-white hover:border-slate-100 transition-all">
                  <div className="space-y-1">
                    <p className="text-slate-700 font-bold text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400 font-medium">
                      {lang === 'en' ? 'Taxable Amount' : 'করযোগ্য আয়'}: ৳{item.taxable.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-black text-slate-900">৳ {item.amount.toLocaleString()}</p>
                </div>
              ))}
              <div className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-100 rounded-2xl mt-4">
                <span className="font-black text-slate-800 uppercase tracking-widest text-sm">{lang === 'en' ? 'Total' : 'মোট'}</span>
                <span className="text-3xl font-black text-orange-600">৳ {tax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;