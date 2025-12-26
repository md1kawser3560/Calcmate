import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '../App';

const TermsOfService = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
          <FileText size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('terms')}</h1>
          <p className="text-slate-500 font-medium text-sm">Last updated: May 2025</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 prose prose-slate max-w-none">
        {lang === 'en' ? (
          <>
            <h2>Agreement to Terms</h2>
            <p>By accessing or using CalcMate, you agree to be bound by these terms of service. If you do not agree with any of these terms, you are prohibited from using this site.</p>

            <h2>Use License</h2>
            <p>Permission is granted to temporarily use the tools on CalcMate for personal, non-commercial transitory viewing only.</p>

            <h2>Disclaimer</h2>
            <p>The tools and information on CalcMate are provided on an 'as is' basis. While we strive for 100% accuracy, CalcMate makes no warranties, expressed or implied, regarding the accuracy or reliability of the calculation results.</p>
            <p>Users should always verify important calculations (especially financial ones like Tax and EMI) with a professional consultant.</p>

            <h2>Limitations</h2>
            <p>In no event shall CalcMate or its suppliers be liable for any damages arising out of the use or inability to use the tools on the website.</p>

            <h2>Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Bangladesh and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
          </>
        ) : (
          <>
            <h2>শর্তাবলীর সাথে সম্মতি</h2>
            <p>ক্যালকমেট অ্যাক্সেস বা ব্যবহার করার মাধ্যমে, আপনি এই ব্যবহারের শর্তাবলীর দ্বারা আবদ্ধ হতে সম্মত হন। আপনি যদি এই শর্তাবলীর সাথে একমত না হন তবে আপনার এই সাইটটি ব্যবহার করা নিষিদ্ধ।</p>

            <h2>ব্যবহারের লাইসেন্স</h2>
            <p>ক্যালকমেট-এর টুলগুলো শুধুমাত্র ব্যক্তিগত ব্যবহারের জন্য ব্যবহারের অনুমতি দেওয়া হয়েছে।</p>

            <h2>দাবিত্যাগ</h2>
            <p>ক্যালকমেট-এর টুল এবং তথ্যগুলো 'যেমন আছে' ভিত্তিতে প্রদান করা হয়। যদিও আমরা ১০০% নির্ভুলতার চেষ্টা করি, তবে ক্যালকমেট ক্যালকুলেশন ফলাফলের নির্ভুলতা বা নির্ভরযোগ্যতা সম্পর্কে কোনও ওয়ারেন্টি প্রদান করে না।</p>
            <p>ব্যবহারকারীদের সর্বদা গুরুত্বপূর্ণ হিসাব (বিশেষ করে ট্যাক্স এবং ইএমআই-এর মতো আর্থিক হিসাব) একজন পেশাদার পরামর্শদাতার সাথে যাচাই করা উচিত।</p>

            <h2>সীমাবদ্ধতা</h2>
            <p>ওয়েবসাইটের টুলগুলো ব্যবহারের ফলে উদ্ভূত কোনো ক্ষতির জন্য কোনো অবস্থাতেই ক্যালকমেট বা এর সরবরাহকারীরা দায়ী থাকবে না।</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TermsOfService;