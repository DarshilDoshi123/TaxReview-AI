import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { blogArticles } from './blogData';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Guides', 'Compliance', 'Filing', 'Tech'];

  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="Tax & AI Auditing Blog" 
        description="Stay updated with the latest in Indian Income Tax, Form 16 reconciliations, AIS guidelines, compliance checks, and AI tax automation."
      />

      {/* Hero Header */}
      <section className="relative py-16 md:py-24 border-b border-slate-200/50 dark:border-slate-900/50 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] -z-10 h-[350px] w-[350px] rounded-full bg-primary-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center space-y-6">
          <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">TaxReview AI Insights</span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            The Tax & Compliance Blog
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Practical guides, tax compliance news, and technical overviews of AI auditing pipelines in India.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              className="block w-full border-0 bg-transparent py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Blog Area */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-12">
          
          {/* Category Filter buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <article 
                  key={article.slug} 
                  className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      <Link to={`/blog/${article.slug}`} className="hover:text-primary-500 transition-colors">
                        {article.title}
                      </Link>
                    </h2>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-450 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <Link 
                      to={`/blog/${article.slug}`} 
                      className="text-primary-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-16 border border-slate-200 dark:border-slate-850 rounded-3xl bg-white dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-500">No blog posts found matching your search options.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default Blog;
