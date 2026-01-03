
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Calculator, Ruler, Clock, Type, Percent, Activity, Calendar, 
  MapPin, QrCode, Binary, Menu, X, Home, Grid3x3, Globe, ChevronRight, 
  Link as LinkIcon, ShieldAlert, FileText, Info, Mail, BookOpen,
  Coins, PiggyBank, FileDown, RefreshCcw, TrendingUp, LayoutGrid, Sparkles,
  Zap, Settings, ShieldCheck, Rocket, Landmark, DollarSign, Baby, Hash, AlignLeft,
  Tag, ReceiptText, Plus, Trash2, Printer, Flame, Gauge, HeartPulse, Scale, Flower,
  Dumbbell, Triangle, BarChart3
} from 'lucide-react';

// Import Pages
import HomePage from './pages/HomePage';
import EMICalculator from './pages/EMICalculator';
import UnitConverter from './pages/UnitConverter';
import BMICalculator from './pages/BMICalculator';
import CalorieCalculator from './pages/CalorieCalculator';
import BodyFatCalculator from './pages/BodyFatCalculator';
import BMRCalculator from './pages/BMRCalculator';
import IdealWeightCalculator from './pages/IdealWeightCalculator';
import PeriodCalculator from './pages/PeriodCalculator';
import LeanBodyMassCalculator from './pages/LeanBodyMassCalculator';
import PythagoreanCalculator from './pages/PythagoreanCalculator';
import StatisticsCalculator from './pages/StatisticsCalculator';
import QRCodeGenerator from './pages/QRCodeGenerator';
import NumberToWords from './pages/NumberToWords';
import GeneralCalculator from './pages/GeneralCalculator';
import TaxCalculator from './pages/TaxCalculator';
import TimeZoneConverter from './pages/TimeZoneConverter';
import CalendarConverter from './pages/CalendarConverter';
import IpLocation from './pages/IpLocation';
import NumberSystem from './pages/NumberSystem';
import UrlShortener from './pages/UrlShortener';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import BlogPage from './pages/BlogPage';
import GoldCalculator from './pages/GoldCalculator';
import SanchaypatraCalculator from './pages/SanchaypatraCalculator';
import DeploymentGuide from './pages/DeploymentGuide';
import MortgageCalculator from './pages/MortgageCalculator';
import CurrencyConverter from './pages/CurrencyConverter';
import AgeCalculator from './pages/AgeCalculator';
import PercentageCalculator from './pages/PercentageCalculator';
import WordCounter from './pages/WordCounter';
import DiscountCalculator from './pages/DiscountCalculator';
import PasswordGenerator from './pages/PasswordGenerator';
import InvoiceMaker from './pages/InvoiceMaker';

// --- Language Context Setup ---
type Language = 'en' | 'bn';
interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    app_name: "Calculator Prime",
    home: "Home",
    featured: "Featured Tools",
    all_tools: "Explore All Tools",
    categories: "Browse by Category",
    finance: "Finance & Tax",
    math: "Math & Calculations",
    health: "Health & Life",
    utilities: "Digital Utilities",
    business: "Business Tools",
    support: "Legal & Support",
    blog: "Blog",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    about: "About Us",
    contact: "Contact Us",
    gen_calc: "General Calculator",
    calc_title: "Professional Calculator",
    calc_sub: "Simple & Scientific calculations",
    emi_calc: "EMI Calculator",
    emi_title: "Professional EMI Calc",
    emi_sub: "Quickly calculate your monthly loan repayments",
    mortgage_calc: "Mortgage Calculator",
    mortgage_title: "Mortgage Estimator",
    mortgage_sub: "Calculate monthly payments with tax & insurance",
    currency_calc: "Currency Converter",
    unit_conv: "Unit Converter",
    bmi_calc: "BMI Calculator",
    calorie_calc: "Calorie Calculator",
    body_fat_calc: "Body Fat Calculator",
    bmr_calc: "BMR Calculator",
    ideal_weight_calc: "Ideal Weight Calculator",
    period_calc: "Period Calculator",
    lbm_calc: "Lean Body Mass Calculator",
    pythagorean_calc: "Pythagorean Theorem Calculator",
    stats_calc: "Statistics Calculator",
    age_calc: "Age Calculator",
    percent_calc: "Percentage Calculator",
    discount_calc: "Discount Calculator",
    password_gen: "Password Generator",
    word_count: "Word Counter",
    qr_gen: "QR Code Generator",
    num_words: "Number to Words",
    tax_calc: "Tax Calculator",
    tax_title: "Income Tax Calculator",
    tax_sub: "Estimate your annual income tax based on latest slabs",
    time_zone: "Time Zone",
    calendar: "Calendar Converter",
    ip_loc: "IP Location",
    num_sys: "Number System",
    url_short: "URL Shortener",
    url_title: "Professional URL Shortener",
    url_sub: "Make your long links short and trackable",
    enter_long_url: "Paste long URL here",
    shorten_now: "Shorten Now",
    shortening: "Shortening...",
    your_short_link: "Your Short Link",
    open_link: "Open Link",
    recent_links: "Recent Links",
    invalid_url: "Please enter a valid URL",
    gold_calc: "Global Gold Price",
    sanchay_calc: "Savings Profit",
    invoice_maker: "Pro Invoice Maker",
    footer_text: "Powered by Onessor IT",
    history: "History",
    no_history: "NO HISTORY YET",
    clear_all: "Clear All",
    standard: "Standard",
    scientific: "Scientific",
    explore: "Explore Tools",
    deploy_guide: "Deployment Guide",
    
    // Homepage New Descriptions
    desc_gold: "Check real-time international gold spot prices and local market value.",
    desc_emi: "Plan your loans by calculating monthly installments and interest instantly.",
    desc_sanchay: "Get accurate monthly profit estimates for BD Savings Certificates.",
    search_placeholder: "What are you looking for today?",
    hero_title: "Precision Tools for",
    hero_highlight: "Smart Living",
    hero_desc: "Calculator Prime is your next-gen digital companion for calculations, logic, and professional utilities. Fast, free, and uniquely built for you.",
    
    // General UI
    calculate: "Calculate",
    clear: "Clear",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    share: "Share Result",
  },
  bn: {
    app_name: "ক্যালকুলেটর প্রাইম",
    home: "হোম",
    featured: "সেরা টুলস",
    all_tools: "সবগুলো টুল দেখুন",
    categories: "ক্যাটাগরি অনুযায়ী",
    finance: "আর্থিক ও ট্যাক্স",
    math: "গণিত ও হিসাব",
    health: "স্বাস্থ্য ও জীবন",
    utilities: "ডিজিটাল ইউটিলিটি",
    business: "ব্যবসা ও বাণিজ্য",
    support: "সহযোগিতা ও শর্তাবলী",
    blog: "ব্লগ",
    privacy: "গোপনীয়তা নীতি",
    terms: "ব্যবহারের শর্তাবলী",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    gen_calc: "সাধারণ ক্যালকুলেটর",
    calc_title: "প্রফেশনাল ক্যালকুলেটর",
    calc_sub: "সাধারণ এবং বৈজ্ঞানিক হিসাব",
    emi_calc: "EMI ক্যালকুলেটর",
    emi_title: "প্রফেশনাল EMI ক্যালক",
    emi_sub: "আপনার মাসিক ঋণের কিস্তি হিসাব করুন",
    mortgage_calc: "মর্টগেজ ক্যালকুলেটর",
    mortgage_title: "মর্টগেজ এস্টিমেটর",
    mortgage_sub: "ট্যাক্স এবং ইন্স্যুরেন্স সহ আপনার মাসিক পেমেন্ট হিসাব করুন",
    currency_calc: "কারেন্সি কনভার্টার",
    unit_conv: "ইউনিট কনভার্টার",
    bmi_calc: "BMI ক্যালকুলেটর",
    calorie_calc: "ক্যালরি ক্যালকুলেটর",
    body_fat_calc: "বডি ফ্যাট ক্যালকুলেটর",
    bmr_calc: "বিএমআর ক্যালকুলেটর",
    ideal_weight_calc: "আদর্শ ওজন ক্যালকুলেটর",
    period_calc: "মাসিক ক্যালকুলেটর",
    lbm_calc: "মাংসপেশির ওজন ক্যালকুলেটর",
    pythagorean_calc: "পিথাগোরাস ক্যালকুলেটর",
    stats_calc: "পরিসংখ্যান ক্যালকুলেটর",
    age_calc: "বয়স ক্যালকুলেটর",
    percent_calc: "পার্সেন্টেজ ক্যালকুলেটর",
    discount_calc: "ডিসকাউন্ট ক্যালকুলেটর",
    password_gen: "পাসওয়ার্ড জেনারেটর",
    word_count: "ওয়ার্ড কাউন্টার",
    qr_gen: "QR জেনারেটর",
    num_words: "কথায় লিখুন",
    tax_calc: "Tax ক্যালকুলেটর",
    tax_title: "আয়কর ক্যালকুলেটর",
    tax_sub: "বাংলাদেশের বর্তমান বিধি অনুযায়ী আপনার আয়কর হিসাব করুন",
    time_zone: "টাইম জোন",
    calendar: "ক্যালেন্ডার",
    ip_loc: "IP লোকেশন",
    num_sys: "নাম্বার সিস্টেম",
    url_short: "ইউআরএল শর্টনার",
    url_title: "প্রফেশনাল ইউআরএল শর্টনার",
    url_sub: "লম্বা লিঙ্কগুলোকে ছোট এবং ট্র্যাকযোগ্য করুন",
    enter_long_url: "লম্বা লিঙ্কটি এখানে দিন",
    shorten_now: "লিঙ্ক ছোট করুন",
    shortening: "কাজ চলছে...",
    your_short_link: "আপনার শর্ট লিঙ্ক",
    open_link: "লিঙ্ক খুলুন",
    recent_links: "সাম্প্রতিক লিঙ্কসমূহ",
    invalid_url: "সঠিক ইউআরএল দিন",
    gold_calc: "স্বর্ণের বাজার দর",
    sanchay_calc: "সঞ্চয়পত্র মুনাফা",
    invoice_maker: "প্রো ইনভয়েস মেকার",
    footer_text: "ওনেসর আইটি দ্বারা পরিচালিত",
    history: "ইতিহাস",
    no_history: "কোন ইতিহাস নেই",
    clear_all: "সব মুছুন",
    standard: "সাধারণ",
    scientific: "বৈজ্ঞানিক",
    explore: "সবগুলো টুলস",
    deploy_guide: "ডিপ্লয়মেন্ট গাইড",

    // Homepage New Descriptions
    desc_gold: "বিশ্ববাজারের লাইভ দর অনুযায়ী আপনার স্বর্ণের দাম হিসাব করুন।",
    desc_emi: "লোনের মাসিক কিস্তি এবং মোট সুদের হিসাব খুব সহজেই করুন।",
    desc_sanchay: "সঞ্চয়পত্রে বিনিয়োগের পর প্রতি মাসে কত লাভ পাবেন তা জানুন।",
    search_placeholder: "আজ আপনি কী খুঁজতেছেন?",
    hero_title: "আধুনিক জীবনের",
    hero_highlight: "স্মার্ট টুলস",
    hero_desc: "ক্যালকুলেটর প্রাইম হলো আপনার পরবর্তী প্রজন্মের ডিজিটাল সঙ্গী। হিসাব-নিকাশ এবং ইউটিলিটির জন্য দ্রুত, ফ্রি এবং সবার জন্য।",

    // General UI
    calculate: "হিসাব করুন",
    clear: "মুছুন",
    copy: "কপি",
    copied: "কপি হয়েছে!",
    download: "ডাউনলোড",
    share: "শেয়ার করুন",
  }
};

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

// --- Components ---

const NavItem = ({ to, icon: Icon, label, onClick, isNew }: { to: string, icon: any, label: string, onClick?: () => void, isNew?: boolean }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={18} className={`transition-colors relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="relative z-10 font-bold text-sm">{label}</span>
      {isNew && (
        <span className="ml-auto relative z-10 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black rounded-md border border-amber-200">NEW</span>
      )}
    </Link>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsNavOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/60 h-20 flex items-center justify-between px-4 lg:px-12 sticky top-0 z-[60] transition-all no-print">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              CP
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent hidden sm:inline-block">
              {t('app_name')}
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1 ml-4">
             <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}>{t('home')}</Link>
             <Link to="/blog" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === '/blog' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}`}>{t('blog')}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
          >
             <Globe size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
             <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 uppercase">
               {lang === 'en' ? 'EN' : 'BN'}
             </span>
          </button>
          
          <button onClick={() => setIsNavOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 group">
             <LayoutGrid size={20} className="group-hover:rotate-12 transition-transform" />
             <span className="text-sm font-black uppercase tracking-widest hidden sm:inline-block">{t('explore')}</span>
          </button>
        </div>
      </header>

      {/* Navigation Drawer Overlay */}
      {isNavOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-[100] backdrop-blur-sm transition-opacity animate-in fade-in duration-300 no-print"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <aside className={`fixed top-0 right-0 z-[110] h-full w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-out no-print ${
        isNavOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-8 flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
             <Sparkles size={20} className="text-amber-500" /> {t('all_tools')}
          </h2>
          <button onClick={() => setIsNavOpen(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-8 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar pb-20">
          <section>
            <div className="px-4 mb-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <div className="h-px w-4 bg-slate-200"></div> {t('business')}
            </div>
            <div className="space-y-1">
              <NavItem to="/invoice-maker" icon={ReceiptText} label={t('invoice_maker')} isNew />
              <NavItem to="/currency-converter" icon={DollarSign} label={t('currency_calc')} />
            </div>
          </section>

          <section>
            <div className="px-4 mb-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <div className="h-px w-4 bg-slate-200"></div> {t('finance')}
            </div>
            <div className="space-y-1">
              <NavItem to="/gold-calculator" icon={Coins} label={t('gold_calc')} />
              <NavItem to="/discount-calculator" icon={Tag} label={t('discount_calc')} />
              <NavItem to="/sanchaypatra-calculator" icon={PiggyBank} label={t('sanchay_calc')} />
              <NavItem to="/emi-calculator" icon={Calculator} label={t('emi_calc')} />
              <NavItem to="/mortgage-calculator" icon={Landmark} label={t('mortgage_calc')} />
              <NavItem to="/tax-calculator" icon={Percent} label={t('tax_calc')} />
            </div>
          </section>

          <section>
            <div className="px-4 mb-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <div className="h-px w-4 bg-slate-200"></div> {t('math')}
            </div>
            <div className="space-y-1">
              <NavItem to="/statistics-calculator" icon={BarChart3} label={t('stats_calc')} isNew />
              <NavItem to="/pythagorean-calculator" icon={Triangle} label={t('pythagorean_calc')} />
              <NavItem to="/percentage-calculator" icon={Percent} label={t('percent_calc')} />
              <NavItem to="/general-calculator" icon={Grid3x3} label={t('gen_calc')} />
              <NavItem to="/unit-converter" icon={Ruler} label={t('unit_conv')} />
              <NavItem to="/number-system" icon={Binary} label={t('num_sys')} />
            </div>
          </section>

          <section>
            <div className="px-4 mb-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <div className="h-px w-4 bg-slate-200"></div> {t('health')}
            </div>
            <div className="space-y-1">
              <NavItem to="/lean-body-mass-calculator" icon={Dumbbell} label={t('lbm_calc')} />
              <NavItem to="/period-calculator" icon={Flower} label={t('period_calc')} />
              <NavItem to="/ideal-weight-calculator" icon={Scale} label={t('ideal_weight_calc')} />
              <NavItem to="/bmr-calculator" icon={HeartPulse} label={t('bmr_calc')} />
              <NavItem to="/body-fat-calculator" icon={Gauge} label={t('body_fat_calc')} />
              <NavItem to="/calorie-calculator" icon={Flame} label={t('calorie_calc')} />
              <NavItem to="/age-calculator" icon={Baby} label={t('age_calc')} />
              <NavItem to="/bmi-calculator" icon={Activity} label={t('bmi_calc')} />
              <NavItem to="/number-to-words" icon={Type} label={t('num_words')} />
            </div>
          </section>

          <section>
            <div className="px-4 mb-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <div className="h-px w-4 bg-slate-200"></div> {t('utilities')}
            </div>
            <div className="space-y-1">
              <NavItem to="/password-generator" icon={ShieldCheck} label={t('password_gen')} />
              <NavItem to="/word-counter" icon={AlignLeft} label={t('word_count')} />
              <NavItem to="/url-shortener" icon={LinkIcon} label={t('url_short')} />
              <NavItem to="/qr-generator" icon={QrCode} label={t('qr_gen')} />
              <NavItem to="/time-zone" icon={Clock} label={t('time_zone')} />
              <NavItem to="/calendar" icon={Calendar} label={t('calendar')} />
              <NavItem to="/ip-location" icon={MapPin} label={t('ip_loc')} />
            </div>
          </section>
        </nav>
      </aside>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-12 lg:p-16 transition-all">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 p-12 text-center no-print mt-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <Link to="/about" className="hover:text-indigo-600 transition-colors">{t('about')}</Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">{t('contact')}</Link>
          <Link to="/privacy" className="hover:text-indigo-600 transition-colors">{t('privacy')}</Link>
          <Link to="/terms" className="hover:text-indigo-600 transition-colors">{t('terms')}</Link>
          <Link to="/blog" className="hover:text-indigo-600 transition-colors">{t('blog')}</Link>
        </div>
        <p className="text-sm text-slate-500 font-medium italic">© 2025 Calculator Prime. {t('footer_text')} 🌏</p>
      </footer>
    </div>
  );
};

const App = () => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('calcmate_lang') as Language) || 'en';
    }
    return 'en';
  });

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('calcmate_lang', next);
      return next;
    });
  };

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/general-calculator" element={<GeneralCalculator />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="/age-calculator" element={<AgeCalculator />} />
            <Route path="/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/password-generator" element={<PasswordGenerator />} />
            <Route path="/word-counter" element={<WordCounter />} />
            <Route path="/gold-calculator" element={<GoldCalculator />} />
            <Route path="/sanchaypatra-calculator" element={<SanchaypatraCalculator />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/calorie-calculator" element={<CalorieCalculator />} />
            <Route path="/body-fat-calculator" element={<BodyFatCalculator />} />
            <Route path="/bmr-calculator" element={<BMRCalculator />} />
            <Route path="/ideal-weight-calculator" element={<IdealWeightCalculator />} />
            <Route path="/period-calculator" element={<PeriodCalculator />} />
            <Route path="/lean-body-mass-calculator" element={<LeanBodyMassCalculator />} />
            <Route path="/pythagorean-calculator" element={<PythagoreanCalculator />} />
            <Route path="/statistics-calculator" element={<StatisticsCalculator />} />
            <Route path="/qr-generator" element={<QRCodeGenerator />} />
            <Route path="/number-to-words" element={<NumberToWords />} />
            <Route path="/tax-calculator" element={<TaxCalculator />} />
            <Route path="/time-zone" element={<TimeZoneConverter />} />
            <Route path="/calendar" element={<CalendarConverter />} />
            <Route path="/ip-location" element={<IpLocation />} />
            <Route path="/number-system" element={<NumberSystem />} />
            <Route path="/url-shortener" element={<UrlShortener />} />
            <Route path="/invoice-maker" element={<InvoiceMaker />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/deployment-guide" element={<DeploymentGuide />} />
          </Routes>
        </Layout>
      </HashRouter>
    </LanguageContext.Provider>
  );
};

export default App;
