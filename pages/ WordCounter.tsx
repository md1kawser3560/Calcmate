import React, { useState, useEffect } from 'react';
import { AlignLeft, Type, Hash, Clock, Trash2, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../App';

function WordCounter() {
    const { lang, t } = useLanguage();
    const [text, setText] = useState<string>('');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        charsNoSpaces: 0,
        paragraphs: 0,
        readingTime: 0
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s+/g, '').length;
        const paragraphs = text.trim() ? text.trim().split(/\n+/).length : 0;
        const readingTime = Math.ceil(words / 200); // Avg 200 wpm

        setStats({ words, chars, charsNoSpaces, paragraphs, readingTime });
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-100">
                        <AlignLeft size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {lang === 'en' ? 'Professional Word Counter' : 'প্রফেশনাল ওয়ার্ড কাউন্টার'}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                            <Sparkles size={14} className="text-amber-500" />
                            {lang === 'en' ? 'Analyze your text content in real-time' : 'রিয়েল-টাইমে আপনার টেক্সট বিশ্লেষণ করুন'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setText('')} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                        <Trash2 size={20} />
                    </button>
                    <button onClick={handleCopy} className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? (lang === 'en' ? 'Copied' : 'কপি হয়েছে') : (lang === 'en' ? 'Copy Text' : 'টেক্সট কপি')}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 px-2">
                {/* Editor Side */}
                <div className="lg:col-span-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-[400px] md:h-[500px] p-6 text-lg text-slate-700 placeholder:text-slate-300 bg-slate-50/50 rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-50/50 transition-all border-none resize-none font-medium"
                        placeholder={lang === 'en' ? 'Paste your content here to start counting...' : 'গণনা শুরু করতে আপনার টেক্সট এখানে পেস্ট করুন...'}
                    ></textarea>
                </div>

                {/* Stats Side */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mb-3"><Type size={20} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'en' ? 'Words' : 'শব্দ'}</span>
                            <span className="text-3xl font-black text-slate-800">{stats.words}</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-3"><Hash size={20} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'en' ? 'Chars' : 'অক্ষর'}</span>
                            <span className="text-3xl font-black text-slate-800">{stats.chars}</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-3"><FileText size={20} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'en' ? 'Paragraphs' : 'প্যারাগ্রাফ'}</span>
                            <span className="text-3xl font-black text-slate-800">{stats.paragraphs}</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl mb-3"><Clock size={20} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{lang === 'en' ? 'Read Time' : 'পড়ার সময়'}</span>
                            <span className="text-xl font-black text-slate-800">~{stats.readingTime} {lang === 'en' ? 'Min' : 'মিনিট'}</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Sparkles size={100} fill="currentColor" />
                        </div>
                        <h3 className="font-black text-lg mb-4">{lang === 'en' ? 'Quick Analysis' : 'দ্রুত বিশ্লেষণ'}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                <span className="text-slate-400">{lang === 'en' ? 'Without Spaces' : 'স্পেস ছাড়া'}</span>
                                <span className="font-bold">{stats.charsNoSpaces}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                <span className="text-slate-400">{lang === 'en' ? 'Avg. Reading Speed' : 'পড়ার গতি'}</span>
                                <span className="font-bold">200 wpm</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-indigo-700 text-xs font-medium leading-relaxed">
                        {lang === 'en' ? 'Tip: Professional articles usually range between 1,000 to 2,500 words for better SEO performance.' : 'টিপস: ভালো এসইও পারফরম্যান্সের জন্য প্রফেশনাল আর্টিকল সাধারণত ১,০০০ থেকে ২,৫০০ শব্দের মধ্যে হয়ে থাকে।'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WordCounter;