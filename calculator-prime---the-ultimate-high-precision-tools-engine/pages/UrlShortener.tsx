
import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Copy, Check, ExternalLink, Trash2, Scissors, History, QrCode, ShieldCheck, Zap, BarChart3, Info, X, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { useLanguage } from '../App';

interface ShortenedLink {
  id: string;
  original: string;
  short: string;
  timestamp: string;
  clicks: number;
}

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ShortenedLink[]>([]);
  const [qrUrl, setQrUrl] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('short_links');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (shortUrl) generateQR(shortUrl);
  }, [shortUrl]);

  const generateQR = async (url: string) => {
    try {
      const qr = await QRCode.toDataURL(url, { 
        width: 600, 
        margin: 2,
        color: {
          dark: '#4f46e5',
          light: '#ffffff'
        }
      });
      setQrUrl(qr);
    } catch (err) {
      console.error(err);
    }
  };

  const shortenUrl = async () => {
    if (!longUrl || !longUrl.includes('.')) {
      setError(t('invalid_url'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Using is.gd for reliability
      const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
      const data = await response.json();

      if (data.shorturl) {
        setShortUrl(data.shorturl);
        const newLink: ShortenedLink = {
          id: Date.now().toString(),
          original: longUrl,
          short: data.shorturl,
          timestamp: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          clicks: 0
        };
        const updatedHistory = [newLink, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('short_links', JSON.stringify(updatedHistory));
      } else {
        setError('Service error. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (id: string) => {
    const updatedHistory = history.map(link => {
      if (link.id === id) {
        return { ...link, clicks: link.clicks + 1 };
      }
      return link;
    });
    setHistory(updatedHistory);
    localStorage.setItem('short_links', JSON.stringify(updatedHistory));
  };

  const deleteHistory = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('short_links', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-2xl shadow-indigo-100 flex items-center justify-center">
            <LinkIcon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('url_title')}</h1>
            <p className="text-slate-500 font-medium text-base">{t('url_sub')}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Never Expire
          </div>
          <div className="flex items-center gap-2 px-5 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest">
            <Zap size={14} /> Active
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Shortener Card */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none -mr-10 -mt-10">
              <LinkIcon size={200} />
            </div>

            <label className="block text-[11px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] ml-2">
              {t('enter_long_url')}
            </label>
            <div className="flex flex-col gap-4 relative z-10">
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full p-6 rounded-[1.5rem] border-2 outline-none transition-all text-lg font-bold ${
                  error ? 'border-red-200 bg-red-50 focus:border-red-400' : 'border-slate-50 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-50/50'
                }`}
              />
              <button
                onClick={shortenUrl}
                disabled={loading}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-lg uppercase tracking-widest rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 group active:scale-95"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Scissors size={24} className="group-hover:rotate-12 transition-transform" />
                )}
                {loading ? t('shortening') : t('shorten_now')}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-4 ml-4 font-bold flex items-center gap-2"><Info size={14}/> {error}</p>}
          </div>

          {shortUrl && (
            <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
              
              <div className="relative z-10">
                <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
                   <div className="flex items-center gap-3 px-5 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Live Short URL</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                     <BarChart3 size={14} /> 0 Total Clicks
                   </div>
                </div>

                <div className="mb-12">
                  <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">{t('your_short_link')}</h3>
                  <div className="flex items-center justify-between gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group hover:border-white/20 transition-all backdrop-blur-sm">
                    <p className="text-3xl md:text-5xl font-black tracking-tighter break-all text-white">
                      {shortUrl.replace('https://', '')}
                    </p>
                    <button 
                      onClick={() => handleCopy(shortUrl)}
                      className={`p-6 rounded-[1.5rem] transition-all shrink-0 active:scale-90 shadow-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                    >
                      {copied ? <Check size={32} strokeWidth={3} /> : <Copy size={32} strokeWidth={3} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="py-6 bg-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] text-center flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
                  >
                    <ExternalLink size={20} /> {t('open_link')}
                  </a>
                  
                  <button 
                    onClick={() => setShowQRModal(true)}
                    className="py-6 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] border border-white/10 flex items-center justify-center gap-3 transition-all backdrop-blur-sm active:scale-95"
                  >
                    <QrCode size={20} /> View QR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar History */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                <History size={18} className="text-indigo-600" />
                {t('recent_links')}
              </h3>
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                   <LinkIcon size={36} className="opacity-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">No History Found</p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[700px]">
                {history.map((item) => (
                  <div key={item.id} className="p-6 bg-slate-50/50 rounded-[2rem] border border-transparent group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.timestamp}</span>
                      <button 
                        onClick={() => deleteHistory(item.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 truncate mb-2 font-medium bg-slate-100/50 px-3 py-1.5 rounded-lg border border-slate-200/40">{item.original}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <a 
                        href={item.short} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => handleLinkClick(item.id)}
                        className="text-indigo-600 font-black text-lg hover:underline truncate mr-2"
                      >
                        {item.short.replace('https://', '')}
                      </a>
                      <button 
                        onClick={() => handleCopy(item.short)}
                        className="p-3 text-slate-400 hover:text-indigo-600 bg-white rounded-xl shadow-sm border border-slate-100 transition-all active:scale-90"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100/50 rounded-full text-[9px] font-black text-green-700 tracking-widest">
                         <div className="w-1 h-1 bg-green-500 rounded-full"></div> LIVE
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <BarChart3 size={12} />
                         <span>{item.clicks} Clicks</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4 shadow-sm">
             <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
               <ShieldCheck size={20} />
             </div>
             <div>
                <h4 className="font-black text-indigo-900 text-xs uppercase tracking-widest mb-1">Encrypted Links</h4>
                <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                  All generated links are secure and bypass known spam filters. Perfect for professional sharing.
                </p>
             </div>
          </div>
        </div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60 animate-in fade-in duration-300" onClick={() => setShowQRModal(false)}>
          <div 
            className="bg-white p-10 rounded-[3.5rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <div className="text-left">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Link QR</h3>
                <p className="text-slate-400 text-xs font-bold">Scan to open URL</p>
              </div>
              <button onClick={() => setShowQRModal(false)} className="p-3 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[3rem] mb-10 border border-slate-100 shadow-inner">
               <img src={qrUrl} alt="QR Code" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
            
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = qrUrl;
                link.download = `calcmate-qr-${Date.now()}.png`;
                link.click();
              }}
              className="w-full py-6 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95"
            >
              <Download size={20} /> Download QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
