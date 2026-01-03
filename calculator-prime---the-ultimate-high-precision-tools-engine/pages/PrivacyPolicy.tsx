import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../App';

const PrivacyPolicy = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
          <ShieldAlert size={30} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('privacy')}</h1>
          <p className="text-slate-500 font-medium text-sm">Last updated: May 2025</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 prose prose-slate max-w-none">
        {lang === 'en' ? (
          <>
            <h2>Introduction</h2>
            <p>Welcome to CalcMate. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at info@onessor.it.</p>

            <h2>Information We Collect</h2>
            <p>We do not collect any personally identifiable information unless you choose to provide it. For example, when you use our IP Location tool, we use third-party APIs to determine your location based on your IP address, but we do not store this data on our servers.</p>

            <h2>Google AdSense & Cookies</h2>
            <p>We use Google AdSense to serve ads on our website. Google, as a third-party vendor, uses cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
            <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank">Ads Settings</a>.</p>

            <h2>Usage Tracking</h2>
            <p>Our website uses local storage to save your calculation history, currency preferences, and theme settings. This data never leaves your device and is used solely to enhance your user experience.</p>

            <h2>Third-Party Links</h2>
            <p>Our website may contain links to other websites. Please be aware that we are not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of each and every website that collects personally identifiable information.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at info@onessor.it.</p>
          </>
        ) : (
          <>
            <h2>ভূমিকা</h2>
            <p>ক্যালকমেট-এ আপনাকে স্বাগতম। আমরা আপনার ব্যক্তিগত তথ্য এবং আপনার গোপনীয়তার অধিকার রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা বিজ্ঞপ্তি বা আমাদের ব্যক্তিগত তথ্যের ক্ষেত্রে আমাদের অনুশীলন সম্পর্কে আপনার যদি কোনও প্রশ্ন বা উদ্বেগ থাকে তবে দয়া করে info@onessor.it এ আমাদের সাথে যোগাযোগ করুন।</p>

            <h2>আমরা যে তথ্য সংগ্রহ করি</h2>
            <p>আপনি যদি তা প্রদান করতে পছন্দ না করেন তবে আমরা ব্যক্তিগতভাবে শনাক্তযোগ্য কোনও তথ্য সংগ্রহ করি না। উদাহরণস্বরূপ, আপনি যখন আমাদের আইপি লোকেশন টুল ব্যবহার করেন, আমরা আপনার আইপি ঠিকানার ভিত্তিতে আপনার অবস্থান নির্ধারণ করতে তৃতীয় পক্ষের এপিআই ব্যবহার করি, কিন্তু আমরা এই ডেটা আমাদের সার্ভারে সংরক্ষণ করি না।</p>

            <h2>গুগল অ্যাডসেন্স এবং কুকিজ</h2>
            <p>আমরা আমাদের ওয়েবসাইটে বিজ্ঞাপন পরিবেশনের জন্য গুগল অ্যাডসেন্স ব্যবহার করি। গুগল, তৃতীয় পক্ষের বিক্রেতা হিসেবে, আমাদের ওয়েবসাইটে বা অন্যান্য ওয়েবসাইটে ব্যবহারকারীর পূর্ববর্তী ভিজিটের ভিত্তিতে বিজ্ঞাপন পরিবেশন করতে কুকিজ ব্যবহার করে। গুগলের বিজ্ঞাপন কুকিজ ব্যবহারের ফলে এটি এবং এর অংশীদাররা আমাদের সাইট এবং/অথবা ইন্টারনেটের অন্যান্য সাইটগুলিতে তাদের ভিজিটের ভিত্তিতে আমাদের ব্যবহারকারীদের বিজ্ঞাপন পরিবেশন করতে সক্ষম হয়।</p>
            <p>ব্যবহারকারীরা <a href="https://www.google.com/settings/ads" target="_blank">বিজ্ঞাপন সেটিংস</a>-এ গিয়ে ব্যক্তিগতকৃত বিজ্ঞাপন থেকে বেরিয়ে আসতে পারেন।</p>

            <h2>ব্যবহার ট্র্যাকিং</h2>
            <p>আমাদের ওয়েবসাইট আপনার ক্যালকুলেশন হিস্ট্রি, কারেন্সি পছন্দ এবং থিম সেটিংস সংরক্ষণ করতে লোকাল স্টোরেজ ব্যবহার করে। এই ডেটা কখনই আপনার ডিভাইস থেকে বের হয় না এবং এটি শুধুমাত্র আপনার ইউজার এক্সপেরিয়েন্স উন্নত করার জন্য ব্যবহার করা হয়।</p>

            <h2>যোগাযোগ</h2>
            <p>এই গোপনীয়তা নীতি সম্পর্কে আপনার যদি কোনও প্রশ্ন থাকে তবে দয়া করে info@onessor.it এ আমাদের সাথে যোগাযোগ করুন।</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;