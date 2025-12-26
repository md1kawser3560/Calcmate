import React, { useEffect, useState } from 'react';
import { MapPin, Globe, Server, Shield, Wifi, RefreshCw, Search } from 'lucide-react';
import { useLanguage } from '../App';

interface IpData {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  asn: string;
  org: string;
}

const IpLocation = () => {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const fetchIp = async (ip: string = '') => {
    setLoading(true);
    setError(false);
    
    // Clean input (handle if it's an event object or string)
    const targetIp = typeof ip === 'string' ? ip.trim() : '';

    // 1. Try Primary API: ipapi.co
    try {
      const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : 'https://ipapi.co/json/';
      const res1 = await fetch(url);
      if (res1.ok) {
        const data = await res1.json();
        if (!data.error) {
            setData({
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                country_code: data.country_code,
                postal: data.postal,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                asn: data.asn,
                org: data.org,
            });
            setLoading(false);
            return;
        }
      }
    } catch (e) {
      console.warn('Primary IP fetch failed, trying fallback...');
    }

    // 2. Try Fallback API: ipwho.is
    try {
      const url = targetIp ? `https://ipwho.is/${targetIp}` : 'https://ipwho.is/';
      const res2 = await fetch(url);
      if (res2.ok) {
        const data = await res2.json();
        if (data.success) {
            setData({
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country,
                country_code: data.country_code,
                postal: data.postal,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone.id,
                asn: data.connection.asn ? data.connection.asn.toString() : '',
                org: data.connection.org || data.connection.isp,
            });
            setLoading(false);
            return;
        }
      }
    } catch (e) {
      console.warn('Second IP fetch failed, trying next fallback...');
    }

    // 3. Try Fallback API: ipinfo.io
    try {
      const url = targetIp ? `https://ipinfo.io/${targetIp}/json` : 'https://ipinfo.io/json';
      const res3 = await fetch(url);
      if (res3.ok) {
        const data = await res3.json();
        const [lat, long] = (data.loc || "0,0").split(',');
        setData({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country, // ipinfo returns code mostly, we use it for both for now or need mapping
            country_code: data.country, 
            postal: data.postal,
            latitude: parseFloat(lat),
            longitude: parseFloat(long),
            timezone: data.timezone,
            asn: '', 
            org: data.org,
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error('All IP fetch methods failed', e);
    }
    
    // If we reach here, all failed
    setError(true);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIp(searchQuery);
  };

  useEffect(() => {
    fetchIp();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <MapPin size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('ip_title')}</h1>
            <p className="text-slate-500">{t('ip_subtitle')}</p>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ip_placeholder')}
            className="flex-1 md:w-64 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
          <button
            type="submit"
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg shadow-red-200"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">{t('loading')}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-2xl text-red-600 text-center border border-red-100">
          <p className="font-bold mb-2">{t('error_title')}</p>
          <p>{t('error_msg')}</p>
          <button 
            onClick={() => fetchIp(searchQuery)} 
            className="mt-4 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium"
          >
            {t('retry')}
          </button>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Main IP Card */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <p className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">{data.ip === searchQuery.trim() ? 'Searched IP' : t('public_ip')}</p>
            <h2 className="text-4xl md:text-5xl font-mono font-bold text-slate-800 mb-6">{data.ip}</h2>
            <button 
              onClick={() => fetchIp(data.ip)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw size={16} /> {t('refresh')}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Location Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Globe size={20} className="text-blue-500" />
                {t('loc_info')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{t('city')}</span>
                  <span className="font-medium text-slate-800">{data.city}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{t('region')}</span>
                  <span className="font-medium text-slate-800">{data.region}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{t('country')}</span>
                  <span className="font-medium text-slate-800 flex items-center gap-2">
                    {data.country} <img src={`https://flagcdn.com/w20/${data.country_code.toLowerCase()}.png`} alt="flag" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('coords')} (Lat, Long)</span>
                  <span className="font-medium text-slate-800 text-xs">{data.latitude}, {data.longitude}</span>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Server size={20} className="text-green-500" />
                {t('net_info')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">{t('isp')}</span>
                  <span className="font-medium text-slate-800 text-right w-1/2 break-words">{data.org}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">ASN</span>
                  <span className="font-medium text-slate-800">{data.asn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('timezone')}</span>
                  <span className="font-medium text-slate-800">{data.timezone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
             <Shield className="shrink-0 mt-0.5" size={18} />
             <p>{t('ip_disclaimer')}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IpLocation;