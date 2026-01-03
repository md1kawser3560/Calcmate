
import React, { useState, useEffect } from 'react';
import { BarChart3, Info, Share2, Check, RefreshCcw, ArrowRight, Zap, ListChecks, Hash, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../App';

interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: string;
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
}

const StatisticsCalculator = () => {
  const { lang, t } = useLanguage();
  const [input, setInput] = useState<string>('12, 15, 18, 22, 25, 28, 30, 35, 40, 45');
  const [data, setData] = useState<number[]>([]);
  const [results, setResults] = useState<StatsResult | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const calculateStats = () => {
    // Parse input: support commas, spaces, newlines
    const numbers = input
      .split(/[,\s\n]+/)
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n));

    if (numbers.length === 0) {
      setData([]);
      setResults(null);
      setChartData([]);
      return;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    sorted.forEach(num => {
      freq[num] = (freq[num] || 0) + 1;
      if (freq[num] > maxFreq) maxFreq = freq[num];
    });
    const modes = Object.keys(freq).filter(k => freq[Number(k)] === maxFreq);
    const modeStr = maxFreq > 1 ? modes.join(', ') : (lang === 'en' ? 'None' : 'নেই');

    // Variance & Std Dev (Sample)
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const stdDev = Math.sqrt(variance);

    // Quartiles (Standard method)
    const getQuartile = (qSorted: number[], q: number) => {
      const pos = (qSorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (qSorted[base + 1] !== undefined) {
        return qSorted[base] + rest * (qSorted[base + 1] - qSorted[base]);
      } else {
        return qSorted[base];
      }
    };

    const q1 = getQuartile(sorted, 0.25);
    const q3 = getQuartile(sorted, 0.75);
    const iqr = q3 - q1;

    const res: StatsResult = {
      count: n,
      sum: sum,
      mean: parseFloat(mean.toFixed(4)),
      median: parseFloat(median.toFixed(4)),
      mode: modeStr,
      min: sorted[0],
      max: sorted[n - 1],
      range: sorted[n - 1] - sorted[0],
      variance: parseFloat(variance.toFixed(4)),
      stdDev: parseFloat(stdDev.toFixed(4)),
      q1: parseFloat(q1.toFixed(4)),
      q3: parseFloat(q3.toFixed(4)),
      iqr: parseFloat(iqr.toFixed(4))
    };

    setResults(res);
    setData(sorted);

    // Prep chart data (Distribution simple view)
    const groups = modes.length > 5 ? 5 : 8;
    const step = (res.range / groups) || 1;
    const chart = [];
    for (let i = 0; i < groups; i++) {
        const start = res.min + (i * step);
        const end = start + step;
        const count = sorted.filter(v => v >= start && v < end).length;
        chart.push({
            range: `${start.toFixed(0)}-${end.toFixed(0)}`,
            value: count
        });
    }
    setChartData(chart);
  };

  useEffect(() => {
    calculateStats();
  }, [input]);

  const handleShare = () => {
    if (!results) return;
    const text = `Data Analysis Summary:\nCount: ${results.count}, Mean: ${results.mean}, Median: ${results.median}, Std Dev: ${results.stdDev}. Calculated via Calculator Prime.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatItem = ({ label, value, colorClass = "text-slate-800" }: { label: string, value: string | number, colorClass?: string }) => (
    <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:border-indigo-100 transition-all">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`font-black text-lg ${colorClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-2">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-2xl shadow-indigo-100 flex items-center justify-center">
            <BarChart3 size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'Statistics Calculator' : 'পরিসংখ্যান ক্যালকুলেটর'}
            </h1>
            <p className="text-slate-500 font-medium text-base">
              {lang === 'en' ? 'Analyze datasets with high-precision measures' : 'নিখুঁত গাণিতিক পরিমাপের মাধ্যমে ডাটা বিশ্লেষণ করুন'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setInput('')}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <RefreshCcw size={16} /> {lang === 'en' ? 'Clear Data' : 'ডাটা মুছুন'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            <div className="space-y-4">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {lang === 'en' ? '1. Enter Dataset' : '১. ডাটা সেট প্রদান করুন'}
              </label>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={8}
                className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none focus:border-indigo-500 focus:bg-white font-mono text-lg text-slate-700 transition-all resize-none shadow-inner"
                placeholder={lang === 'en' ? "Example: 10, 20, 30, 40..." : "উদাহরণ: ১০, ২০, ৩০, ৪০..."}
              />
              <p className="text-[10px] text-slate-400 italic px-2">
                {lang === 'en' ? '* Separate numbers with commas, spaces, or newlines.' : '* সংখ্যাগুলো কমা, স্পেস অথবা এন্টার দিয়ে আলাদা করুন।'}
              </p>
            </div>

            {results && (
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 text-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase mb-1 block">Count (n)</span>
                    <span className="text-3xl font-black text-indigo-700">{results.count}</span>
                 </div>
                 <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                    <span className="text-[10px] font-black text-emerald-400 uppercase mb-1 block">Sum (Σx)</span>
                    <span className="text-3xl font-black text-emerald-700">{results.sum.toLocaleString()}</span>
                 </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <Calculator size={150} fill="currentColor" className="text-indigo-400" />
              </div>
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Sample Mean (Average)</h3>
              <div className="flex items-end gap-3 mb-8">
                 <span className="text-7xl font-black tracking-tighter leading-none">{results?.mean || '--'}</span>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                    <span className="text-slate-400">Median</span>
                    <span className="font-bold text-indigo-300">{results?.median || '--'}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Mode</span>
                    <span className="font-bold text-indigo-300">{results?.mode || '--'}</span>
                 </div>
              </div>
          </div>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Results Grid */}
          <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
               <ListChecks size={16} className="text-indigo-600" /> {lang === 'en' ? 'Detailed Analysis' : 'বিস্তারিত বিশ্লেষণ'}
             </h3>
             
             {results ? (
               <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-4">
                     <StatItem label="Standard Deviation (σ)" value={results.stdDev} colorClass="text-indigo-600" />
                     <StatItem label="Variance (σ²)" value={results.variance} />
                     <StatItem label="Range (Max-Min)" value={results.range} />
                     <StatItem label="Min / Max" value={`${results.min} / ${results.max}`} />
                  </div>

                  <div className="pt-8 border-t border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Quartiles & IQR</h4>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="p-5 bg-slate-50 rounded-2xl text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Q1 (25th)</p>
                          <p className="font-black text-slate-800 text-xl">{results.q1}</p>
                       </div>
                       <div className="p-5 bg-slate-50 rounded-2xl text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Q3 (75th)</p>
                          <p className="font-black text-slate-800 text-xl">{results.q3}</p>
                       </div>
                       <div className="p-5 bg-indigo-50 rounded-2xl text-center border border-indigo-100">
                          <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">IQR</p>
                          <p className="font-black text-indigo-700 text-xl">{results.iqr}</p>
                       </div>
                    </div>
                  </div>

                  {/* Distribution Chart */}
                  <div className="pt-8 border-t border-slate-50">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Distribution Overview</h4>
                     <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="range" hide />
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                              />
                              <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]}>
                                 {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <button 
                    onClick={handleShare}
                    className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                  >
                    {copied ? <Check size={20} /> : <Share2 size={20} />}
                    {copied ? 'Copied to Clipboard' : 'Share Full Analysis'}
                  </button>
               </div>
             ) : (
               <div className="text-center py-20 opacity-30">
                  <BarChart3 size={60} className="mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">Input data to see results</p>
               </div>
             )}
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
             <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                <Info size={24} />
             </div>
             <p className="text-sm text-indigo-800 font-medium leading-relaxed">
               {lang === 'en' 
                ? 'Statistical measures help in understanding the spread and central point of your data. The Sample Standard Deviation provides an estimate of how much the values in your set differ from the mean.' 
                : 'পরিসংখ্যানগত পরিমাপগুলো আপনার ডাটার মূল কেন্দ্রবিন্দু এবং এর বিস্তৃতি বুঝতে সাহায্য করে। স্ট্যান্ডার্ড ডেভিয়েশন দেখায় আপনার ডাটা সেটের মানগুলো গড় থেকে কতটা দূরে অবস্থিত।'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCalculator;
