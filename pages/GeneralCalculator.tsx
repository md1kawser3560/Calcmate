import React, { useState, useEffect } from 'react';
import { History, Trash2, Delete, Calculator as CalcIcon, X, Check } from 'lucide-react';
import { useLanguage } from '../App';

type Mode = 'standard' | 'scientific';

interface HistoryItem {
  id: number;
  expression: string;
  result: string;
  timestamp: string;
}

const GeneralCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('calc_mode') as Mode) || 'standard';
    }
    return 'standard';
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const savedHistory = localStorage.getItem('calc_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('calc_mode', mode);
  }, [mode]);

  const handlePress = (val: string) => {
    if (val === 'C') {
      setInput('');
      setResult('');
    } else if (val === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (val === '=') {
      calculateResult();
    } else {
      const isOperator = ['+', '-', '×', '÷', '^', '.'].includes(val);
      if (isOperator && input === '' && val !== '-') return;
      if (isOperator && ['+', '-', '×', '÷', '^', '.'].includes(input.slice(-1))) {
        setInput(input.slice(0, -1) + val);
        return;
      }
      setInput(prev => prev + val);
    }
  };

  const calculateResult = () => {
    try {
      if (!input) return;

      let evalString = input
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      const openCount = (evalString.match(/\(/g) || []).length;
      const closeCount = (evalString.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        evalString += ')'.repeat(openCount - closeCount);
      }

      const calcFunc = new Function('return ' + evalString);
      const calcResult = calcFunc();
      
      if (!isFinite(calcResult) || isNaN(calcResult)) {
        setResult('Error');
        return;
      }

      const finalResult = Number.isInteger(calcResult) 
        ? calcResult.toString() 
        : parseFloat(calcResult.toFixed(8)).toString();
      
      setResult(finalResult);
      addToHistory(input, finalResult);
      setInput(finalResult);
    } catch (error) {
      setResult('Error');
    }
  };

  const addToHistory = (expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      expression: expr,
      result: res,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    if (window.confirm(t('clear_all') + '?')) {
      setHistory([]);
    }
  };

  const deleteHistoryItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const copyToInput = (val: string, id: number) => {
    setInput(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  // UI Styles from Screenshot
  const btnBase = "h-14 md:h-16 rounded-xl text-lg md:text-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center border";
  const numBtn = `${btnBase} bg-white text-slate-800 border-slate-100 shadow-sm hover:bg-slate-50`;
  const opBtn = `${btnBase} bg-[#EEF2FF] text-[#4F46E5] border-indigo-50 hover:bg-indigo-100`;
  const sciBtn = `${btnBase} bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 text-sm font-medium`;
  const actionBtn = `${btnBase} bg-[#FEF2F2] text-[#EF4444] border-rose-50 hover:bg-rose-100`;
  const equalBtn = `${btnBase} bg-[#4F46E5] text-white border-transparent col-span-2 shadow-lg shadow-indigo-200/50 hover:bg-indigo-700`;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 px-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
            <CalcIcon size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('calc_title')}</h1>
            <p className="text-slate-500 font-medium text-sm">{t('calc_sub')}</p>
          </div>
        </div>

        {/* Mode Pill Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 shadow-sm">
          <button
            onClick={() => setMode('standard')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'standard' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            {t('standard')}
          </button>
          <button
            onClick={() => setMode('scientific')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'scientific' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            {t('scientific')}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 px-2">
        {/* Main Body */}
        <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-100/80">
          
          {/* Display */}
          <div className="bg-slate-50/50 rounded-3xl p-10 mb-10 border border-slate-100/60 flex flex-col items-end justify-center min-h-[160px] relative">
            <div className="text-slate-400 text-sm font-mono absolute top-6 right-10 opacity-70">
              {result && `${input} =`}
            </div>
            <div className="text-6xl md:text-7xl font-bold text-slate-800 font-mono tracking-tight text-right w-full">
              {input || '0'}
            </div>
          </div>

          {/* Keypad Layout */}
          <div className={`grid gap-5 ${mode === 'scientific' ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-4'}`}>
            {mode === 'scientific' && (
              <>
                <button onClick={() => handlePress('sin(')} className={sciBtn}>sin</button>
                <button onClick={() => handlePress('cos(')} className={sciBtn}>cos</button>
                <button onClick={() => handlePress('tan(')} className={sciBtn}>tan</button>
                <button onClick={() => handlePress('π')} className={sciBtn}>π</button>
                <button onClick={() => handlePress('e')} className={sciBtn}>e</button>
                <button onClick={() => handlePress('log(')} className={sciBtn}>log</button>
                <button onClick={() => handlePress('ln(')} className={sciBtn}>ln</button>
                <button onClick={() => handlePress('√(')} className={sciBtn}>√</button>
                <button onClick={() => handlePress('^')} className={sciBtn}>x^y</button>
                <button onClick={() => handlePress('(')} className={sciBtn}>(</button>
                <button onClick={() => handlePress(')')} className={sciBtn}>)</button>
              </>
            )}

            <button onClick={() => handlePress('C')} className={`${actionBtn} ${mode === 'scientific' ? '' : 'col-span-2'}`}>AC</button>
            <button onClick={() => handlePress('DEL')} className={actionBtn}><Delete size={22}/></button>
            <button onClick={() => handlePress('÷')} className={opBtn}>÷</button>
            {mode === 'scientific' && <div className="hidden md:block"></div>}

            <button onClick={() => handlePress('7')} className={numBtn}>7</button>
            <button onClick={() => handlePress('8')} className={numBtn}>8</button>
            <button onClick={() => handlePress('9')} className={numBtn}>9</button>
            <button onClick={() => handlePress('×')} className={opBtn}>×</button>
            {mode === 'scientific' && <div className="hidden md:block"></div>}

            <button onClick={() => handlePress('4')} className={numBtn}>4</button>
            <button onClick={() => handlePress('5')} className={numBtn}>5</button>
            <button onClick={() => handlePress('6')} className={numBtn}>6</button>
            <button onClick={() => handlePress('-')} className={opBtn}>-</button>
            {mode === 'scientific' && <div className="hidden md:block"></div>}

            <button onClick={() => handlePress('1')} className={numBtn}>1</button>
            <button onClick={() => handlePress('2')} className={numBtn}>2</button>
            <button onClick={() => handlePress('3')} className={numBtn}>3</button>
            <button onClick={() => handlePress('+')} className={opBtn}>+</button>
            {mode === 'scientific' && <div className="hidden md:block"></div>}

            <button onClick={() => handlePress('0')} className={numBtn}>0</button>
            <button onClick={() => handlePress('.')} className={numBtn}>.</button>
            <button onClick={() => handlePress('=')} className={equalBtn}>=</button>
            {mode === 'scientific' && <div className="hidden md:block"></div>}
          </div>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-[500px]">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-100 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3 text-slate-800 font-extrabold text-xl tracking-tight">
                <History size={22} className="text-indigo-600" />
                <h3>{t('history')}</h3>
              </div>
              {history.length > 0 && (
                 <button onClick={clearHistory} className="text-slate-300 hover:text-rose-500 transition-colors">
                   <Trash2 size={20} />
                 </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-5">
                <div className="w-24 h-24 bg-slate-50/80 rounded-full flex items-center justify-center">
                  <History size={40} className="opacity-20" />
                </div>
                <p className="font-black text-sm uppercase tracking-widest text-slate-400 opacity-60">{t('no_history')}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                {history.map((item) => (
                  <div key={item.id} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/60 group hover:border-indigo-100 transition-all relative">
                    <div className="text-[10px] font-bold text-slate-400 mb-2 flex justify-between uppercase tracking-wider">
                      <span>{item.timestamp}</span>
                      <button 
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-slate-500 text-xs font-mono mb-2 opacity-60">{item.expression} =</div>
                    <div className="flex justify-between items-center">
                      <div className="text-slate-800 font-bold text-2xl font-mono tracking-tight">{item.result}</div>
                      <button 
                        onClick={() => copyToInput(item.result, item.id)}
                        className="px-3 py-1.5 text-indigo-600 bg-white border border-indigo-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm text-[10px] font-black"
                      >
                        {copiedId === item.id ? <Check size={14} /> : "USE"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralCalculator;