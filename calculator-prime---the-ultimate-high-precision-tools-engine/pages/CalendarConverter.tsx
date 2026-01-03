import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../App';

const CalendarConverter = () => {
  const [date, setDate] = useState(new Date());
  const { t } = useLanguage();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDate(new Date(e.target.value));
    }
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    setDate(newDate);
  };

  // Formatters
  const formatEnglish = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(d);
  };

  const formatBangla = (d: Date) => {
    // Note: Browser implementation of Bengali calendar may vary.
    // This uses the standard Intl API.
    return new Intl.DateTimeFormat('bn-BD-u-ca-beng', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  };

  const formatHijri = (d: Date) => {
    return new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  };

  // Helper to get raw English date for input
  const getInputValue = () => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
          <Calendar size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('cal_title')}</h1>
          <p className="text-slate-500">{t('cal_sub')}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <label className="text-slate-500 font-medium mb-3">{t('select_date')}</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => adjustDate(-1)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <input 
              type="date" 
              value={getInputValue()}
              onChange={handleDateChange}
              className="px-6 py-3 rounded-xl border border-slate-300 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <button 
              onClick={() => adjustDate(1)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* English */}
          <div className="flex items-center p-5 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="w-16 text-center">
              <span className="text-2xl">🇬🇧</span>
            </div>
            <div className="border-l border-indigo-200 pl-5">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{t('eng_date')}</p>
              <p className="text-xl font-bold text-slate-800">{formatEnglish(date)}</p>
            </div>
          </div>

          {/* Bangla */}
          <div className="flex items-center p-5 bg-green-50 rounded-xl border border-green-100">
            <div className="w-16 text-center">
              <span className="text-2xl">🇧🇩</span>
            </div>
            <div className="border-l border-green-200 pl-5">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">{t('bn_date')}</p>
              <p className="text-xl font-bold text-slate-800">{formatBangla(date)}</p>
            </div>
          </div>

          {/* Hijri */}
          <div className="flex items-center p-5 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-16 text-center">
              <span className="text-2xl">🇸🇦</span>
            </div>
            <div className="border-l border-amber-200 pl-5">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">{t('hijri_date')}</p>
              <p className="text-xl font-bold text-slate-800">{formatHijri(date)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-slate-400">
        {t('cal_note')}
      </div>
    </div>
  );
};

export default CalendarConverter;