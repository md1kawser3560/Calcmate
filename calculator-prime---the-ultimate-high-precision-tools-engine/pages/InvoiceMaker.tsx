import React, { useState, useEffect, useRef } from 'react';
import { 
  ReceiptText, Plus, Trash2, Printer, Check, Info, Settings2, 
  Image as ImageIcon, Eye, Edit3, Palette, Save, 
  CreditCard, User, Calendar, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, Zap, Wallet, Landmark,
  Globe
} from 'lucide-react';
import { useLanguage } from '../App';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number | string;
  rate: number | string;
  total: number;
}

const currencies = [
  { code: 'BDT', symbol: '৳' },
  { code: 'USD', symbol: '$' },
  { code: 'INR', symbol: '₹' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

const accentColors = [
  { id: 'indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-600', light: 'bg-indigo-50/50', hover: 'hover:bg-indigo-700' },
  { id: 'emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50/50', hover: 'hover:bg-emerald-700' },
  { id: 'rose', bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', light: 'bg-rose-50/50', hover: 'hover:bg-rose-700' },
  { id: 'slate', bg: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', light: 'bg-slate-100/50', hover: 'hover:bg-slate-900' },
  { id: 'violet', bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-600', light: 'bg-violet-50/50', hover: 'hover:bg-violet-700' },
];

const paymentOptions = [
  { id: 'cash', en: 'Cash in Hand', bn: 'ক্যাশ ইন হ্যান্ড', icon: Wallet },
  { id: 'online', en: 'Online Payment', bn: 'অনলাইন পেমেন্ট', icon: Globe },
  { id: 'mobile', en: 'Mobile Banking', bn: 'মোবাইল ব্যাংকিং', icon: Zap },
  { id: 'bank', en: 'Bank Transfer', bn: 'ব্যাংক ট্রান্সফার', icon: Landmark },
];

export default function InvoiceMaker() {
  const { lang, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // App States
  const [isPreview, setIsPreview] = useState(false);
  const [accent, setAccent] = useState(accentColors[0]);
  const [logo, setLogo] = useState<string | null>(null);

  // Invoice Data States
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2025-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  
  const [businessName, setBusinessName] = useState('Your Company Name');
  const [businessAddress, setBusinessAddress] = useState('123 Street, Dhaka, Bangladesh');
  const [businessEmail, setBusinessEmail] = useState('contact@company.com');
  const [businessPhone, setBusinessPhone] = useState('+880 1XXX XXXXXX');
  
  const [clientName, setClientName] = useState('Client Name');
  const [clientAddress, setClientAddress] = useState('Client Address, City');
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Web Design Service', quantity: 1, rate: 5000, total: 5000 }
  ]);
  
  const [taxPercent, setTaxPercent] = useState<number | string>(0);
  const [currency, setCurrency] = useState(currencies[0]);
  const [notes, setNotes] = useState('Thank you for choosing our services. Please pay within the due date.');
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['mobile', 'cash']);

  // Persistence
  useEffect(() => {
    const savedData = localStorage.getItem('calcmate_invoice_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.businessName) setBusinessName(parsed.businessName);
        if (parsed.businessAddress) setBusinessAddress(parsed.businessAddress);
        if (parsed.businessEmail) setBusinessEmail(parsed.businessEmail);
        if (parsed.businessPhone) setBusinessPhone(parsed.businessPhone);
        if (parsed.logo) setLogo(parsed.logo);
        if (parsed.accentId) setAccent(accentColors.find(a => a.id === parsed.accentId) || accentColors[0]);
        if (parsed.selectedPayments) setSelectedPayments(parsed.selectedPayments);
      } catch (e) { console.error("Failed to load draft", e); }
    }
  }, []);

  const handleSaveSettings = () => {
    const data = { businessName, businessAddress, businessEmail, businessPhone, logo, accentId: accent.id, selectedPayments };
    localStorage.setItem('calcmate_invoice_draft', JSON.stringify(data));
    alert(lang === 'en' ? "Business details saved!" : "আপনার তথ্যগুলো সেভ করা হয়েছে!");
  };

  const togglePaymentMethod = (id: string) => {
    setSelectedPayments(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Improved Safe Number Helper
  const safeNum = (val: any): number => {
    if (typeof val === 'string') {
        const cleaned = val.replace(/[^0-9.]/g, '');
        const n = parseFloat(cleaned);
        return isNaN(n) ? 0 : n;
    }
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // Reliable Calculations
  const subtotal = items.reduce((acc, item) => acc + (safeNum(item.total)), 0);
  const safeTaxPercent = safeNum(taxPercent);
  const taxAmount = (subtotal * safeTaxPercent) / 100;
  const total = subtotal + taxAmount;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, total: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const q = safeNum(updated.quantity);
        const r = safeNum(updated.rate);
        updated.total = q * r;
        return updated;
      }
      return item;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 px-2 no-print">
        <div className="flex items-center gap-5">
          <div className={`p-4 ${accent.bg} rounded-[1.5rem] text-white shadow-2xl transition-all duration-500`}>
            <ReceiptText size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'Pro Invoice Maker' : 'প্রো ইনভয়েস মেকার'}
            </h1>
            <p className="text-slate-500 font-medium text-sm flex items-center gap-2 uppercase tracking-widest">
              <Settings2 size={14} className={accent.text} /> 
              {lang === 'en' ? 'Live Editor' : 'লাইভ এডিটর'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 flex gap-2 shadow-sm">
            {accentColors.map(c => (
              <button 
                key={c.id} 
                onClick={() => setAccent(c)}
                className={`w-8 h-8 rounded-xl transition-all ${c.bg} ${accent.id === c.id ? 'ring-4 ring-slate-200 scale-110' : 'opacity-40 hover:opacity-100'}`}
              />
            ))}
          </div>
          
          <button onClick={handlePrint} className={`flex items-center gap-3 px-10 py-5 ${accent.bg} ${accent.hover} text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-100 active:scale-95`}>
            <Printer size={20} /> {lang === 'en' ? 'Download PDF' : 'পিডিএফ সেভ করুন'}
          </button>
        </div>
      </div>

      {/* THE INVOICE PAPER */}
      <div id="invoice-paper" className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden transition-all duration-700 print:shadow-none print:border-none print:rounded-none">
        
        {/* Style for forced print colors and inversions */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            #invoice-paper { 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
              font-family: 'Inter', 'Hind Siliguri', sans-serif !important;
              color: #0f172a !important;
            }
            .no-print { display: none !important; }
            .print-white { background: white !important; color: #0f172a !important; border: 1px solid #f1f5f9 !important; box-shadow: none !important; }
            .print-text-dark { color: #0f172a !important; }
            .print-text-slate { color: #64748b !important; }
            .print-border-slate { border-color: #f1f5f9 !important; }
            .print-hide { display: none !important; }
          }
        ` }} />

        {/* Decorative Stripe */}
        <div className={`absolute top-0 right-0 w-80 h-2 ${accent.bg} opacity-20`}></div>

        <div className="p-12 md:p-20 space-y-16">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex gap-10 items-start flex-1 w-full">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-40 h-40 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden shrink-0 ${logo ? 'border-transparent' : 'border-slate-200 bg-slate-50 hover:border-indigo-400'} no-print`}
              >
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-slate-300 mb-1" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-2">Brand Logo</span>
                  </>
                )}
              </div>
              {logo && <img src={logo} alt="Logo" className="hidden print:block w-32 h-32 object-contain shrink-0" />}
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

              <div className="flex-1 space-y-4 pt-2">
                <input 
                  className="text-4xl md:text-5xl font-black text-slate-900 w-full outline-none bg-transparent placeholder:text-slate-100 border-none p-0 focus:ring-0 leading-tight"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Brand"
                />
                <div className="space-y-1.5">
                   <div className="flex items-center gap-3 text-slate-500 font-bold text-xs md:text-sm">
                      <MapPin size={14} className="text-slate-300 shrink-0"/>
                      <input className="w-full bg-transparent border-none p-0 outline-none focus:ring-0" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Business Address" />
                   </div>
                   <div className="flex items-center gap-3 text-slate-500 font-bold text-xs md:text-sm">
                      <Mail size={14} className="text-slate-300 shrink-0"/>
                      <input className="w-full bg-transparent border-none p-0 outline-none focus:ring-0" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="Support Email" />
                   </div>
                   <div className="flex items-center gap-3 text-slate-500 font-bold text-xs md:text-sm">
                      <Phone size={14} className="text-slate-300 shrink-0"/>
                      <input className="w-full bg-transparent border-none p-0 outline-none focus:ring-0" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} placeholder="Contact Phone" />
                   </div>
                </div>
              </div>
            </div>

            <div className="md:text-right space-y-6 shrink-0 w-full md:w-auto">
              <h2 className={`text-6xl md:text-8xl font-black ${accent.text} opacity-10 uppercase tracking-tighter leading-none mb-2`}>INVOICE</h2>
              <div className="space-y-3">
                <div className="flex items-center md:justify-end gap-5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serial #</span>
                  <input className="md:text-right font-black text-xl text-slate-800 outline-none border-b border-slate-50 focus:border-indigo-500 w-40 bg-transparent transition-colors" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                </div>
                <div className="flex items-center md:justify-end gap-5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Date</span>
                  <input type="date" className="md:text-right font-bold text-slate-600 outline-none w-40 bg-transparent text-base" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* BILLING INFO SECTION */}
          <div className="grid md:grid-cols-2 gap-16 pt-16 border-t border-slate-50">
            <div className="space-y-5">
              <h3 className={`text-[10px] font-black ${accent.text} uppercase tracking-[0.3em] flex items-center gap-2`}>
                <User size={14} /> Bill To Recipient
              </h3>
              <div className="space-y-2">
                <input 
                  className="text-3xl font-black text-slate-800 w-full outline-none hover:bg-slate-50 px-2 py-1 rounded-xl transition-all border-none bg-transparent focus:ring-0" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder="Client Name" 
                />
                <textarea 
                  className="w-full text-slate-500 font-bold outline-none hover:bg-slate-50 px-2 py-1 rounded-xl resize-none border-none bg-transparent focus:ring-0 text-sm leading-relaxed" 
                  rows={2} 
                  value={clientAddress} 
                  onChange={(e) => setClientAddress(e.target.value)} 
                  placeholder="Address, Phone, etc."
                />
              </div>
            </div>
            <div className="md:text-right flex flex-col justify-start">
               <div className="space-y-2">
                  <h3 className={`text-[10px] font-black ${accent.text} uppercase tracking-[0.4em] flex items-center md:justify-end gap-2`}>
                    <Calendar size={14} /> Deadline
                  </h3>
                  <input type="date" className="md:text-right font-black text-2xl text-slate-800 outline-none bg-transparent w-full focus:ring-0 border-none" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
               </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="pt-8">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className={`${accent.bg} text-white`}>
                  <th className="p-5 rounded-tl-2xl text-[10px] font-black uppercase tracking-widest text-left">Services</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center">Rate</th>
                  <th className="p-5 rounded-tr-2xl text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                  <th className="p-5 no-print w-10 bg-white"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border-x border-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="p-5">
                      <input 
                        className="w-full font-bold text-slate-700 outline-none bg-transparent border-none p-0 focus:ring-0"
                        placeholder="Task description..."
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </td>
                    <td className="p-5">
                      <input 
                        type="number"
                        className="w-full text-center font-bold text-slate-700 outline-none bg-transparent border-none p-0 focus:ring-0"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      />
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
                        <span className="text-slate-300 text-xs">{currency.symbol}</span>
                        <input 
                          type="number"
                          className="w-20 text-center outline-none bg-transparent border-none p-0 focus:ring-0"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        />
                      </div>
                    </td>
                    <td className="p-5 text-right font-black text-slate-900">
                      {currency.symbol}{(safeNum(item.total)).toLocaleString()}
                    </td>
                    <td className="p-5 text-center no-print">
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1.5">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className={`mt-6 flex items-center gap-2 px-6 py-3 ${accent.light} ${accent.text} rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-95 transition-all no-print`}>
              <Plus size={16} /> Add Entry
            </button>
          </div>

          {/* SUMMARY SECTION */}
          <div className="grid lg:grid-cols-12 gap-12 pt-12 border-t border-slate-50">
            {/* Left Column: Payment & Notes */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <h3 className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2`}>
                  <CreditCard size={14} className={accent.text} /> Payments
                </h3>
                <div className="flex flex-wrap gap-2.5 no-print">
                  {paymentOptions.map((opt) => {
                    const isActive = selectedPayments.includes(opt.id);
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => togglePaymentMethod(opt.id)}
                        className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all relative ${
                          isActive 
                            ? `${accent.light} ${accent.border} text-slate-900` 
                            : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-100'
                        }`}
                      >
                        <opt.icon size={16} className={isActive ? accent.text : 'text-slate-300'} />
                        <span className={`font-black text-[10px] uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                          {lang === 'en' ? opt.en : opt.bn}
                        </span>
                        {isActive && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white"><Check size={8} strokeWidth={4} /></div>}
                      </button>
                    );
                  })}
                </div>
                {/* Print view for selected payment methods */}
                <div className="hidden print:flex flex-wrap gap-6 pt-2">
                   {selectedPayments.map(id => {
                      const opt = paymentOptions.find(o => o.id === id);
                      return opt ? (
                        <div key={id} className="flex items-center gap-2 text-slate-700 font-bold text-xs print-text-dark">
                          <CheckCircle2 size={14} className={accent.text} />
                          <span>{lang === 'en' ? opt.en : opt.bn}</span>
                        </div>
                      ) : null;
                   })}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Special Instructions</h3>
                <textarea 
                  className="w-full p-6 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] outline-none focus:bg-white focus:border-indigo-100 transition-all text-xs font-bold text-slate-500 italic resize-none shadow-inner"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Terms, thanks, etc."
                />
              </div>
            </div>

            {/* Right Column: Calculations Card - Refined & Minimized */}
            <div className="lg:col-span-6">
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between print-white">
                  {/* Decorative element - Hidden in print */}
                  <div className={`absolute -right-12 -top-12 w-40 h-40 ${accent.bg} opacity-10 rounded-full blur-[40px] print-hide`}></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center text-slate-400 print-text-slate">
                      <span className="font-black text-[9px] uppercase tracking-[0.3em]">Subtotal</span>
                      <span className="font-black text-lg text-white print-text-dark">{currency.symbol}{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-slate-400 print-text-slate">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-[9px] uppercase tracking-[0.3em]">Applied Tax</span>
                        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl text-[9px] no-print border border-white/5">
                          <input 
                            className="w-8 text-center outline-none font-black bg-transparent text-white focus:ring-0 border-none p-0" 
                            value={taxPercent} 
                            onChange={(e) => setTaxPercent(e.target.value)} 
                          />
                          <span className="text-slate-500 font-black">%</span>
                        </div>
                        {safeTaxPercent > 0 && <span className="hidden print:inline text-[9px] font-black text-slate-400">({safeTaxPercent}%)</span>}
                      </div>
                      <span className="font-black text-lg text-white print-text-dark">{currency.symbol}{taxAmount.toLocaleString()}</span>
                    </div>

                    <div className="pt-6 border-t border-white/10 mt-4 print-border-slate">
                      <div className="flex items-end justify-between">
                        <div className="space-y-4">
                          <div>
                            <span className={`font-black ${accent.text} text-[9px] uppercase tracking-[0.4em] block mb-2`}>Total Balance Due</span>
                            <div className="no-print flex items-center gap-2">
                              <select 
                                className="bg-white/5 border border-white/10 text-[9px] font-black text-slate-300 px-3 py-1.5 rounded-lg uppercase outline-none cursor-pointer hover:bg-white/10 transition-colors" 
                                value={currency.code} 
                                onChange={(e) => setCurrency(currencies.find(c => c.code === e.target.value) || currencies[0])}
                              >
                                {currencies.map(c => <option key={c.code} value={c.code} className="bg-slate-900 text-white">{c.code}</option>)}
                              </select>
                              <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                <Zap size={8} fill="currentColor" className="text-amber-500" /> SECURE
                              </div>
                            </div>
                            <span className="hidden print:inline text-[9px] font-black text-slate-500 uppercase tracking-widest print-text-slate">{currency.code} NETWORK</span>
                          </div>
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                           <span className="text-xl font-bold text-slate-500 leading-none print-text-slate">{currency.symbol}</span>
                           <span className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-[-4px] print-text-dark">
                             {(safeNum(total)).toLocaleString()}
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center gap-3 print-hide">
                     <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Billing v4.5</span>
                     </div>
                     <div className="ml-auto flex items-center gap-1.5 text-slate-500">
                        <ShieldCheck size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* SIGNATURE AREA */}
          <div className="pt-20 flex justify-end">
            <div className="text-center space-y-6 w-64 md:w-80">
              <div className="h-px bg-slate-100 w-full mb-4 print-border-slate"></div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] print-text-slate">Auth Signature & Stamp</p>
              <p className={`font-black text-base uppercase ${accent.text} tracking-wider`}>{businessName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR (DRAFT MANAGER) */}
      <div className="mt-12 no-print lg:col-span-12 flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
            <Palette size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Local Draft Sync</p>
            <h4 className="text-white font-bold text-sm">Your brand and business settings are auto-saved.</h4>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 shadow-xl"
          >
            <Save size={18} /> Save Brand
          </button>
          <button 
            onClick={handlePrint}
            className={`flex items-center gap-3 px-10 py-4 ${accent.bg} text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95`}
          >
            <Printer size={18} /> Download Professional PDF
          </button>
        </div>
      </div>
    </div>
  );
}
