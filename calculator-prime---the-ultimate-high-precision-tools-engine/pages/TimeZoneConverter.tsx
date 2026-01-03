import React, { useState, useEffect } from 'react';
import { Clock, Globe, Search, X } from 'lucide-react';
import { useLanguage } from '../App';

const allCities = [
  { name: 'ঢাকা (Dhaka)', country: 'Bangladesh', zone: 'Asia/Dhaka', code: 'BD' },
  { name: 'লন্ডন (London)', country: 'United Kingdom', zone: 'Europe/London', code: 'GB' },
  { name: 'নিউ ইয়র্ক (New York)', country: 'USA', zone: 'America/New_York', code: 'US' },
  { name: 'মক্কা (Makkah)', country: 'Saudi Arabia', zone: 'Asia/Riyadh', code: 'SA' },
  { name: 'দুবাই (Dubai)', country: 'UAE', zone: 'Asia/Dubai', code: 'AE' },
  { name: 'কুয়ালালামপুর (Kuala Lumpur)', country: 'Malaysia', zone: 'Asia/Kuala_Lumpur', code: 'MY' },
  { name: 'সিডনি (Sydney)', country: 'Australia', zone: 'Australia/Sydney', code: 'AU' },
  { name: 'টোকিও (Tokyo)', country: 'Japan', zone: 'Asia/Tokyo', code: 'JP' },
  { name: 'সিঙ্গাপুর (Singapore)', country: 'Singapore', zone: 'Asia/Singapore', code: 'SG' },
  { name: 'প্যারিস (Paris)', country: 'France', zone: 'Europe/Paris', code: 'FR' },
  { name: 'টরন্টো (Toronto)', country: 'Canada', zone: 'America/Toronto', code: 'CA' },
  { name: 'বার্লিন (Berlin)', country: 'Germany', zone: 'Europe/Berlin', code: 'DE' },
  { name: 'হংকং (Hong Kong)', country: 'Hong Kong', zone: 'Asia/Hong_Kong', code: 'HK' },
  { name: 'দিল্লি (Delhi)', country: 'India', zone: 'Asia/Kolkata', code: 'IN' },
  { name: 'ইস্তাম্বুল (Istanbul)', country: 'Turkey', zone: 'Europe/Istanbul', code: 'TR' },
  { name: 'মস্কো (Moscow)', country: 'Russia', zone: 'Europe/Moscow', code: 'RU' },
  { name: 'লস্ এঞ্জেলেস (Los Angeles)', country: 'USA', zone: 'America/Los_Angeles', code: 'US' },
  { name: 'রোম (Rome)', country: 'Italy', zone: 'Europe/Rome', code: 'IT' },
  { name: 'ব্যাংকক (Bangkok)', country: 'Thailand', zone: 'Asia/Bangkok', code: 'TH' },
  { name: 'কায়রো (Cairo)', country: 'Egypt', zone: 'Africa/Cairo', code: 'EG' },
  { name: 'রিয়াদ (Riyadh)', country: 'Saudi Arabia', zone: 'Asia/Riyadh', code: 'SA' },
  { name: 'সিউল (Seoul)', country: 'South Korea', zone: 'Asia/Seoul', code: 'KR' },
  { name: 'সাংহাই (Shanghai)', country: 'China', zone: 'Asia/Shanghai', code: 'CN' },
  { name: 'শিকাগো (Chicago)', country: 'USA', zone: 'America/Chicago', code: 'US' },
  { name: 'জোনেসবার্গ (Johannesburg)', country: 'South Africa', zone: 'Africa/Johannesburg', code: 'ZA' },
  { name: 'রিও ডি জেনিরো (Rio de Janeiro)', country: 'Brazil', zone: 'America/Sao_Paulo', code: 'BR' },
  { name: 'লুক্সেমবার্গ (Luxembourg)', country: 'Luxembourg', zone: 'Europe/Luxembourg', code: 'LU' },
  { name: 'অ্যামস্টারডাম (Amsterdam)', country: 'Netherlands', zone: 'Europe/Amsterdam', code: 'NL' },
  { name: 'মেক্সিকো সিটি (Mexico City)', country: 'Mexico', zone: 'America/Mexico_City', code: 'MX' },
  { name: 'জাকার্তা (Jakarta)', country: 'Indonesia', zone: 'Asia/Jakarta', code: 'ID' },
];

const TimeZoneConverter = () => {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, zone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);
    } catch (e) {
      return "--:--:--";
    }
  };

  const formatDate = (date: Date, zone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      return "---";
    }
  };

  const filteredCities = allCities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-100 rounded-xl text-cyan-600">
            <Clock size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('time_title')}</h1>
            <p className="text-slate-500">{t('time_sub')}</p>
          </div>
        </div>

        <div className="relative w-full md:w-80 group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country or city..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-slate-200 focus:border-cyan-500 outline-none transition-colors bg-white shadow-sm focus:shadow-md"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {filteredCities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">No cities found</h3>
          <p className="text-slate-500 text-sm">Try searching for a different city or country</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
            const isDhaka = city.zone === 'Asia/Dhaka';
            const isSpecial = isDhaka && searchQuery === ''; 

            return (
              <div 
                key={city.zone} 
                className={`p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                  isSpecial
                    ? 'bg-cyan-600 text-white border-cyan-600 md:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-center items-center text-center order-first lg:order-none' 
                    : 'bg-white border-slate-100 hover:border-cyan-200'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className={`text-2xl font-bold mb-2 ${isSpecial ? 'mx-auto' : 'text-slate-400'}`}>{city.code}</div>
                  {!isSpecial && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{city.country}</span>}
                </div>
                
                <h2 className={`font-bold mb-1 leading-tight ${isSpecial ? 'text-3xl text-cyan-50' : 'text-lg text-slate-700'}`}>
                  {city.name}
                </h2>
                
                <div className={`font-mono font-bold tracking-wider ${isSpecial ? 'text-5xl my-6' : 'text-3xl text-slate-900 mt-2'}`}>
                  {formatTime(time, city.zone)}
                </div>
                
                <p className={`font-medium ${isSpecial ? 'text-cyan-100' : 'text-slate-500'}`}>
                  {formatDate(time, city.zone)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-cyan-50 p-6 rounded-xl border border-cyan-100 text-cyan-800">
        <h4 className="font-bold mb-2 flex items-center gap-2">
          <Globe size={18} />
          {t('time_title')} Info
        </h4>
        <p className="text-sm">
          {t('time_info')}
        </p>
      </div>
    </div>
  );
};

export default TimeZoneConverter;