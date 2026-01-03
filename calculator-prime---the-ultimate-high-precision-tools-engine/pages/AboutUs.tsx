
import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowLeft, Share2, Info, Heart, Globe, Zap } from 'lucide-react';
import { useLanguage } from '../App';

const AboutUs = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
          <Info size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('about')}</h1>
          <p className="text-slate-500 font-medium text-sm">Empowering your digital daily life</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {lang === 'en' ? 'Who we are' : 'আমরা কে'}
          </h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            {lang === 'en' 
              ? "Calculator Prime is a product of Onessor IT. We are a dedicated team of developers and designers passionate about building simple, fast, and accessible digital tools for everyone. Our goal is to simplify complex daily calculations through technology."
              : "ক্যালকুলেটর প্রাইম ওনেসর আইটি (Onessor IT)-এর একটি পণ্য। আমরা ডেভেলপার এবং ডিজাইনারদের একটি নিবেদিত দল যারা সবার জন্য সহজ, দ্রুত এবং অ্যাক্সেসযোগ্য ডিজিটাল টুল তৈরির বিষয়ে আগ্রহী। আমাদের লক্ষ্য প্রযুক্তির মাধ্যমে প্রতিদিনের জটিল হিসাবগুলোকে সহজ করা।"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart size={28} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">User Centric</h3>
            <p className="text-sm text-slate-500">Every feature is designed with the user's ease of use in mind.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap size={28} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Lightning Fast</h3>
            <p className="text-sm text-slate-500">Built using modern web technologies for instant results.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe size={28} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Global & Local</h3>
            <p className="text-sm text-slate-500">Supporting global standards with specialized local tools.</p>
          </div>
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            To become the most trusted all-in-one digital utility platform for users in Bangladesh and beyond.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
