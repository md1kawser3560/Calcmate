import React, { useState } from 'react';
import { Mail, Send, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '../App';

const ContactUs = () => {
  const { lang, t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Area */}
      <div className="flex items-center gap-5 mb-12 px-2">
        <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600 shadow-sm border border-indigo-100/50">
          <Mail size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
          </h1>
          <p className="text-slate-500 font-medium text-base">
            {lang === 'en' ? "We'd love to hear from you" : "আমরা আপনার মতামত শুনতে আগ্রহী"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex gap-5 group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">EMAIL</p>
                <p className="font-extrabold text-slate-800 text-lg">info@onessorit.ai</p>
              </div>
            </div>
            
            <div className="flex gap-5 group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">SUPPORT</p>
                <p className="font-extrabold text-slate-800 text-lg">+8801976428962</p>
              </div>
            </div>
            
            <div className="flex gap-5 group">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">LOCATION</p>
                <p className="font-extrabold text-slate-800 text-lg">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <MessageSquare size={120} />
            </div>
            <h3 className="font-black text-xl mb-4 relative z-10">Corporate Office</h3>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium relative z-10 opacity-90">
              Onessor IT Solutions Limited, Level 4, Block-B, IT Park Area, Dhaka.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-8 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                  {lang === 'en' ? 'Full Name' : 'আপনার নাম'}
                </label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="John Doe"
                />
              </div>
              <div className="group">
                <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                  {lang === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা'}
                </label>
                <input 
                  required 
                  type="email" 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="hello@example.com"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                {lang === 'en' ? 'Subject' : 'বিষয়'}
              </label>
              <input 
                required 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="How can we help you?"
              />
            </div>
            
            <div className="group">
              <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">
                {lang === 'en' ? 'Message' : 'বার্তা'}
              </label>
              <textarea 
                required 
                rows={5} 
                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={`w-full py-6 rounded-[1.5rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl ${
                sent 
                  ? 'bg-emerald-500 text-white shadow-emerald-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {sent ? (
                <>
                  <ShieldCheck size={24} /> 
                  {lang === 'en' ? 'Message Sent!' : 'বার্তা পাঠানো হয়েছে!'}
                </>
              ) : (
                <>
                  <Send size={24} /> 
                  {lang === 'en' ? 'Send Message' : 'বার্তা পাঠান'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Local component for the success icon to avoid direct import issues if needed
const ShieldCheck = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default ContactUs;