import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowLeft, Share2, Info } from 'lucide-react';
import { useLanguage } from '../App';
import { blogPosts, BlogPost } from '../data/blogData';

const BlogPage = () => {
  const { lang, t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (!selectedPost) {
    return (
      <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
              <BookOpen size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('blog')}</h1>
              <p className="text-slate-500 font-medium text-sm">{lang === 'en' ? 'Educational guides for smart users' : 'স্মার্ট ইউজারদের জন্য শিক্ষামূলক গাইড'}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt={post.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase mb-3">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                  {post.title[lang]}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {post.excerpt[lang]}
                </p>
                <div className="text-indigo-600 font-bold text-sm flex items-center gap-2">
                  {lang === 'en' ? 'Read More' : 'আরও পড়ুন'} <ArrowLeft size={16} className="rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => setSelectedPost(null)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={20} /> {lang === 'en' ? 'Back to Blog' : 'ব্লগে ফিরে যান'}
      </button>

      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
        <div className="h-[300px] md:h-[450px] w-full relative">
           <img src={selectedPost.image} alt={selectedPost.title[lang]} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
           <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 md:right-12">
              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow-lg">
                {selectedPost.category}
              </span>
              <h1 className="text-2xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
                {selectedPost.title[lang]}
              </h1>
           </div>
        </div>

        <div className="p-6 md:p-14">
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100">
             <div className="flex items-center gap-8 text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">
               <span className="flex items-center gap-2"><Calendar size={20} className="text-indigo-500" /> {selectedPost.date}</span>
               <span className="flex items-center gap-2"><Clock size={20} className="text-indigo-500" /> {selectedPost.readTime}</span>
             </div>
             <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"><Share2 size={20} /></button>
          </div>

          <div 
            className="prose prose-slate lg:prose-xl max-w-none text-slate-600 leading-relaxed
              prose-h3:text-slate-800 prose-h3:font-black prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
              prose-p:mb-6 prose-p:text-lg
              prose-ul:my-8 prose-li:mb-2 prose-li:text-lg
              prose-strong:text-indigo-600 prose-strong:font-bold
              prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:rounded-2xl prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:my-10 prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: selectedPost.content[lang] }}
          />
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black">CM</div>
                <div>
                   <p className="font-black text-slate-800 uppercase tracking-widest text-xs">Written by</p>
                   <p className="text-slate-500 font-bold">CalcMate Editorial Team</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                  {lang === 'en' ? 'Scroll to Top' : 'উপরে ফিরে যান'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;