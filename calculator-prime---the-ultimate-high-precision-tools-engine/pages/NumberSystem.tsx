import React, { useState } from 'react';
import { Binary, Copy, Check } from 'lucide-react';
import { useLanguage } from '../App';

const NumberSystem = () => {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');
  const [octal, setOctal] = useState('');
  const [hex, setHex] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const { t } = useLanguage();

  const reset = () => {
    setBinary('');
    setDecimal('');
    setOctal('');
    setHex('');
  };

  const handleDecimal = (val: string) => {
    if (val === '') { reset(); return; }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setDecimal(val);
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    } else {
      setDecimal(val); // allow typing
    }
  };

  const handleBinary = (val: string) => {
    if (val === '') { reset(); return; }
    // Only allow 0 and 1
    if (/^[01]+$/.test(val)) {
      const num = parseInt(val, 2);
      setBinary(val);
      setDecimal(num.toString(10));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    }
  };

  const handleOctal = (val: string) => {
    if (val === '') { reset(); return; }
    // Only allow 0-7
    if (/^[0-7]+$/.test(val)) {
      const num = parseInt(val, 8);
      setOctal(val);
      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setHex(num.toString(16).toUpperCase());
    }
  };

  const handleHex = (val: string) => {
    if (val === '') { reset(); return; }
    // Allow 0-9, A-F
    if (/^[0-9A-Fa-f]+$/.test(val)) {
      const num = parseInt(val, 16);
      setHex(val.toUpperCase());
      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setOctal(num.toString(8));
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const InputField = ({ label, value, onChange, placeholder, type }: any) => (
    <div className="relative group">
      <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none font-mono text-lg bg-white"
        placeholder={placeholder}
      />
      {value && (
        <button 
          onClick={() => copyToClipboard(value, type)}
          className="absolute right-3 top-[38px] p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {copied === type ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-slate-800 rounded-xl text-white">
          <Binary size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('ns_title')}</h1>
          <p className="text-slate-500">{t('ns_sub')}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid gap-6">
          <InputField 
            label={`${t('dec')} (10)`} 
            value={decimal} 
            onChange={handleDecimal} 
            placeholder="Ex: 125"
            type="dec"
          />
          <InputField 
            label={`${t('bin')} (2)`} 
            value={binary} 
            onChange={handleBinary} 
            placeholder="Ex: 1111101"
            type="bin"
          />
          <InputField 
            label={`${t('oct')} (8)`} 
            value={octal} 
            onChange={handleOctal} 
            placeholder="Ex: 175"
            type="oct"
          />
          <InputField 
            label={`${t('hex')} (16)`} 
            value={hex} 
            onChange={handleHex} 
            placeholder="Ex: 7D"
            type="hex"
          />
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500">
          <h4 className="font-bold text-slate-700 mb-2">{t('help')}:</h4>
          <p>{t('ns_guide')}</p>
        </div>
      </div>
    </div>
  );
};

export default NumberSystem;