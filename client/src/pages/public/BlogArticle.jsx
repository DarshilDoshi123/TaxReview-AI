import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import { blogArticles } from './blogData';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  ChevronRight,
  List,
  ChevronLeft
} from 'lucide-react';

const BlogArticle = () => {
  const { slug } = useParams();
  const article = blogArticles.find(a => a.slug === slug);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  // If article not found, redirect to Blog listing
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Get index for Prev/Next navigation
  const currentIndex = blogArticles.findIndex(a => a.slug === slug);
  const prevArticle = currentIndex > 0 ? blogArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < blogArticles.length - 1 ? blogArticles[currentIndex + 1] : null;

  // Get related articles (exclude current, take up to 3)
  const related = blogArticles
    .filter(a => a.slug !== slug && (a.category === article.category || a.author === article.author))
    .slice(0, 3);

  // Extract headings for Table of Contents
  const headingLines = article.content
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('## ') || l.startsWith('### '));
  
  const tocItems = headingLines.map(line => {
    const level = line.startsWith('## ') ? 2 : 3;
    const text = line.replace(/^#{2,3}\s+/, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { level, text, id };
  });

  // Safe Inline Markdown Helper (bold, links)
  const renderInline = (text) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 dark:text-primary-400 hover:underline font-semibold transition-colors">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // List element renderer
  const renderList = (items, type, key) => {
    if (type === 'ul') {
      return (
        <ul key={key} className="my-6 space-y-3.5 pl-6 list-disc text-slate-700 dark:text-slate-300 text-sm md:text-[17px] leading-[1.8] text-justify hyphens-auto">
          {items.map((item, idx) => (
            <li key={idx} className="marker:text-primary-500 pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={key} className="my-6 space-y-3.5 pl-6 list-decimal text-slate-700 dark:text-slate-300 text-sm md:text-[17px] leading-[1.8] text-justify hyphens-auto">
          {items.map((item, idx) => (
            <li key={idx} className="marker:text-primary-500 marker:font-bold pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    }
  };

  // Table element renderer
  const renderTable = (rows, key) => {
    const dataRows = rows.filter(r => !r.includes(':---') && !r.includes('----') && r.trim() !== '|');
    if (dataRows.length === 0) return null;

    const headerCells = dataRows[0].split('|').map(c => c.trim()).filter(Boolean);
    const bodyRows = dataRows.slice(1).map(row => row.split('|').map(c => c.trim()).filter(Boolean));

    return (
      <div key={key} className="my-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-xs md:text-sm text-left text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-850">
            <tr>
              {headerCells.map((h, idx) => (
                <th key={idx} className="px-5 py-4">{renderInline(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
            {bodyRows.map((cells, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                {cells.map((c, colIdx) => (
                  <td key={colIdx} className="px-5 py-4 leading-relaxed">{renderInline(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Main block element parser
  const parseBlocks = (content) => {
    const lines = content.split('\n');
    const blocks = [];
    
    let currentList = null;
    let currentListType = null;
    let currentTable = null;
    let inCodeBlock = false;
    let codeBlockLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          blocks.push(
            <pre key={`code-${i}`} className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-[13px] leading-relaxed overflow-x-auto my-6 border border-slate-900 shadow-inner select-all">
              <code>{codeBlockLines.join('\n')}</code>
            </pre>
          );
          codeBlockLines = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockLines.push(lines[i]);
        continue;
      }

      // Close open list if necessary
      if (currentList && !line.startsWith('- ') && !line.startsWith('* ') && !/^\d+\.\s/.test(line)) {
        blocks.push(renderList(currentList, currentListType, `list-${i}`));
        currentList = null;
        currentListType = null;
      }

      // Close open table if necessary
      if (currentTable && !line.startsWith('|')) {
        blocks.push(renderTable(currentTable, `table-${i}`));
        currentTable = null;
      }

      if (!line) {
        continue;
      }

      // 1. Headings
      if (line.startsWith('### ')) {
        const headingText = line.substring(4);
        const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        blocks.push(
          <h3 key={`h3-${i}`} id={headingId} className="text-lg md:text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-white scroll-mt-24">
            {renderInline(headingText)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        const headingText = line.substring(3);
        const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        blocks.push(
          <h2 key={`h2-${i}`} id={headingId} className="text-xl md:text-2xl font-extrabold mt-12 mb-6 text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-2.5 scroll-mt-24">
            {renderInline(headingText)}
          </h2>
        );
      }
      // 2. Blockquotes & Callouts
      else if (line.startsWith('> ')) {
        const blockQuoteText = line.substring(2).trim();
        
        if (blockQuoteText.startsWith('[!NOTE]')) {
          blocks.push(
            <div key={`note-${i}`} className="my-8 p-5 rounded-2xl bg-primary-500/5 border-l-4 border-l-primary-500 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block mb-1">Deduction Note</span>
              {renderInline(blockQuoteText.substring(7).trim())}
            </div>
          );
        } else if (blockQuoteText.startsWith('[!WARNING]')) {
          blocks.push(
            <div key={`warn-${i}`} className="my-8 p-5 rounded-2xl bg-amber-500/5 border-l-4 border-l-amber-500 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">Filing Warning</span>
              {renderInline(blockQuoteText.substring(10).trim())}
            </div>
          );
        } else {
          blocks.push(
            <blockquote key={`quote-${i}`} className="my-8 pl-5 border-l-4 border-l-slate-300 dark:border-l-slate-800 italic text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              {renderInline(blockQuoteText)}
            </blockquote>
          );
        }
      }
      // 3. Unordered Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const itemText = line.substring(2);
        if (!currentList) {
          currentList = [itemText];
          currentListType = 'ul';
        } else {
          currentList.push(itemText);
        }
      }
      // 4. Ordered Lists
      else if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '');
        if (!currentList) {
          currentList = [itemText];
          currentListType = 'ol';
        } else {
          currentList.push(itemText);
        }
      }
      // 5. Tables
      else if (line.startsWith('|')) {
        if (!currentTable) {
          currentTable = [line];
        } else {
          currentTable.push(line);
        }
      }
      // 6. Paragraphs
      else {
        const isLead = blocks.length === 0;
        blocks.push(
          <p key={`p-${i}`} className={`text-slate-600 dark:text-slate-300 leading-[1.8] text-justify hyphens-auto ${isLead ? 'text-base md:text-[19px] font-medium text-slate-850 dark:text-slate-100 mb-8 mt-2' : 'text-sm md:text-[17px] my-6'}`}>
            {renderInline(line)}
          </p>
        );
      }
    }

    // Flush remaining items
    if (currentList) {
      blocks.push(renderList(currentList, currentListType, 'list-end'));
    }
    if (currentTable) {
      blocks.push(renderTable(currentTable, 'table-end'));
    }

    return blocks;
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.summary,
    "datePublished": new Date(article.date).toISOString().split('T')[0],
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "TaxReview AI",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    }
  };

  return (
    <>
      <SEO 
        title={article.title} 
        description={article.summary}
        ogType="article"
        schema={articleSchema}
      />

      {/* Sticky reading progress bar directly below the sticky header */}
      <div 
        className="fixed top-16 left-0 h-[3px] bg-gradient-to-r from-primary-500 to-indigo-600 z-50 transition-all duration-75" 
        style={{ width: `${scrollProgress}%` }} 
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
        
        {/* Back Link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-10 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to insights</span>
        </Link>

        {/* Hero Meta Header */}
        <header className="space-y-6 max-w-[820px] mb-12">
          <div className="flex items-center space-x-3.5">
            <span className="text-[9px] font-extrabold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-[10px] text-slate-450 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-450 pt-2">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                {article.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <span>By {article.author}</span>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Published {article.date}</span>
            </div>
          </div>
        </header>

        {/* Grid layout for Article Content & Sticky TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 max-w-[820px] w-full">
            
            {/* Inline Table of Contents on mobile */}
            {tocItems.length > 0 && (
              <div className="lg:hidden mb-8 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-3 flex items-center gap-2">
                  <List className="h-4.5 w-4.5 text-primary-500" />
                  <span>Table of Contents</span>
                </span>
                <ul className="space-y-2 text-xs">
                  {tocItems.map(item => (
                    <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
                      <a href={`#${item.id}`} className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="article-body">
              {parseBlocks(article.content)}
            </div>

            {/* Previous & Next Article Navigation */}
            <div className="mt-16 pt-8 border-t border-slate-250/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link 
                  to={`/blog/${prevArticle.slug}`}
                  className="group flex flex-col justify-between border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:border-primary-500/30 transition-all text-left"
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Previous Article</span>
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                    {prevArticle.title}
                  </h4>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link 
                  to={`/blog/${nextArticle.slug}`}
                  className="group flex flex-col justify-between border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:border-primary-500/30 transition-all text-right"
                >
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <span>Next Article</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                    {nextArticle.title}
                  </h4>
                </Link>
              ) : <div />}
            </div>

          </div>

          {/* Sticky Table of Contents Sidebar (Desktop only) */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pl-4 border-l border-slate-200/60 dark:border-slate-800 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                <List className="h-4 w-4 text-primary-500" />
                <span>Outline</span>
              </span>
              <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {tocItems.map(item => (
                  <li 
                    key={item.id} 
                    style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                  >
                    <a 
                      href={`#${item.id}`} 
                      className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}

        </div>

        {/* Related Articles Footer */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm md:text-base font-bold mb-6 flex items-center gap-2 uppercase tracking-wider text-slate-900 dark:text-white">
              <Bookmark className="h-4 w-4 text-indigo-500" />
              <span>Related Reads</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <div 
                  key={item.slug} 
                  className="border border-slate-200 dark:border-slate-850 p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      <Link to={`/blog/${item.slug}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h4>
                  </div>
                  <Link 
                    to={`/blog/${item.slug}`} 
                    className="text-[10px] font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-4"
                  >
                    <span>Read article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default BlogArticle;
