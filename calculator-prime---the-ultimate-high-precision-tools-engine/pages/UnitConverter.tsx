import React, { useState, useEffect } from 'react';
import { Ruler, ArrowRightLeft } from 'lucide-react';
import { useLanguage } from '../App';

type UnitCategory = 'length' | 'weight' | 'temperature';

const units: Record<UnitCategory, string[]> = {
  length: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Inch', 'Foot', 'Yard', 'Mile'],
  weight: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce'],
  temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
};

const UnitConverter = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>(units.length[0]);
  const [toUnit, setToUnit] = useState<string>(units.length[1]);
  const [inputValue, setInputValue] = useState<number>(1);
  const [result, setResult] = useState<number>(0);
  const { t } = useLanguage();

  // Conversion logic (simplified for demonstration)
  const convert = (val: number, from: string, to: string, type: UnitCategory) => {
    if (from === to) return val;

    let inBase = val;

    // Convert to base unit
    if (type === 'length') { // Base: Meter
      if (from === 'Kilometer') inBase = val * 1000;
      else if (from === 'Centimeter') inBase = val / 100;
      else if (from === 'Millimeter') inBase = val / 1000;
      else if (from === 'Inch') inBase = val * 0.0254;
      else if (from === 'Foot') inBase = val * 0.3048;
      else if (from === 'Yard') inBase = val * 0.9144;
      else if (from === 'Mile') inBase = val * 1609.34;
    } else if (type === 'weight') { // Base: Gram
      if (from === 'Kilogram') inBase = val * 1000;
      else if (from === 'Milligram') inBase = val / 1000;
      else if (from === 'Pound') inBase = val * 453.592;
      else if (from === 'Ounce') inBase = val * 28.3495;
    } else if (type === 'temperature') {
      // Temp is special
      let celsius = val;
      if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
      if (from === 'Kelvin') celsius = val - 273.15;

      if (to === 'Celsius') return celsius;
      if (to === 'Fahrenheit') return (celsius * 9/5) + 32;
      if (to === 'Kelvin') return celsius + 273.15;
      return celsius; 
    }

    // Convert from base unit
    if (type === 'length') {
      if (to === 'Meter') return inBase;
      if (to === 'Kilometer') return inBase / 1000;
      if (to === 'Centimeter') return inBase * 100;
      if (to === 'Millimeter') return inBase * 1000;
      if (to === 'Inch') return inBase / 0.0254;
      if (to === 'Foot') return inBase / 0.3048;
      if (to === 'Yard') return inBase / 0.9144;
      if (to === 'Mile') return inBase / 1609.34;
    } else if (type === 'weight') {
      if (to === 'Gram') return inBase;
      if (to === 'Kilogram') return inBase / 1000;
      if (to === 'Milligram') return inBase * 1000;
      if (to === 'Pound') return inBase / 453.592;
      if (to === 'Ounce') return inBase / 28.3495;
    }

    return inBase;
  };

  useEffect(() => {
    // Reset units when category changes
    if (!units[category].includes(fromUnit)) setFromUnit(units[category][0]);
    if (!units[category].includes(toUnit)) setToUnit(units[category][1]);
  }, [category]);

  useEffect(() => {
    const res = convert(inputValue, fromUnit, toUnit, category);
    setResult(res);
  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 rounded-xl text-green-600">
          <Ruler size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('unit_title')}</h1>
          <p className="text-slate-500">{t('unit_sub')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Category Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {(['length', 'weight', 'temperature'] as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                category === cat 
                  ? 'bg-white text-primary border-t-2 border-primary' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        <div className="p-8 grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
          
          {/* From */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase">{t('from')}</label>
            <input 
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full text-3xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-primary outline-none py-2 bg-transparent"
            />
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-primary outline-none"
            >
              {units[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Switch Icon */}
          <div className="flex justify-center md:pt-6">
            <div className="p-3 bg-slate-100 rounded-full text-slate-400">
              <ArrowRightLeft size={24} />
            </div>
          </div>

          {/* To */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase">{t('to')}</label>
            <div className="w-full text-3xl font-bold text-primary border-b-2 border-transparent py-2 truncate">
              {Number(result.toFixed(4))}
            </div>
            <select 
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-primary outline-none"
            >
              {units[category].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UnitConverter;