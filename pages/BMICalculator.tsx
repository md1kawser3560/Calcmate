import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from '../App';

const BMICalculator = () => {
  const [weight, setWeight] = useState<string>('70');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('7');
  const [bmi, setBmi] = useState<number | null>(null);
  const { t } = useLanguage();

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const ft = parseFloat(heightFt);
    const inc = parseFloat(heightIn);

    if (w > 0 && ft >= 0 && inc >= 0) {
      const heightInMeters = ((ft * 12) + inc) * 0.0254;
      const bmiValue = w / (heightInMeters * heightInMeters);
      setBmi(bmiValue);
    }
  };

  const getStatus = (val: number) => {
    if (val < 18.5) return { text: t('underweight'), color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (val < 25) return { text: t('normal'), color: 'text-green-500', bg: 'bg-green-100' };
    if (val < 30) return { text: t('overweight'), color: 'text-orange-500', bg: 'bg-orange-100' };
    return { text: t('obese'), color: 'text-red-500', bg: 'bg-red-100' };
  };

  const status = bmi ? getStatus(bmi) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
          <Activity size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('bmi_title')}</h1>
          <p className="text-slate-500">{t('bmi_sub')}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('weight_kg')}</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              placeholder="Ex: 70"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('height_ft')}</label>
            <input 
              type="number" 
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              placeholder="Ex: 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('height_in')}</label>
            <input 
              type="number" 
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
              placeholder="Ex: 8"
            />
          </div>
        </div>

        <button 
          onClick={calculateBMI}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-200"
        >
          {t('calc_bmi')}
        </button>

        {bmi && status && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="text-sm text-slate-500 mb-2">{t('bmi_score')}</div>
            <div className="text-5xl font-extrabold text-slate-800 mb-4">{bmi.toFixed(1)}</div>
            <div className={`inline-block px-4 py-2 rounded-full font-bold ${status.color} ${status.bg}`}>
              {status.text}
            </div>
            
            {/* Visual Bar */}
            <div className="mt-6 h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-yellow-300"></div> {/* Underweight */}
              <div className="absolute top-0 bottom-0 left-1/4 w-1/4 bg-green-500"></div> {/* Normal */}
              <div className="absolute top-0 bottom-0 left-2/4 w-1/6 bg-orange-400"></div> {/* Overweight */}
              <div className="absolute top-0 bottom-0 right-0 w-[33.33%] bg-red-500"></div> {/* Obese */}
              
              {/* Marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-black shadow-xl"
                style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;