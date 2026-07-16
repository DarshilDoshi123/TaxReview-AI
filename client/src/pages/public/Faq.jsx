import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { 
  ChevronDown, 
  HelpCircle, 
  Search,
  MessageSquare,
  Shield,
  Layers,
  Zap
} from 'lucide-react';

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(null);

  const toggleFaq = (index) => {
    setActiveIdx(activeIdx === index ? null : index);
  };

  const faqs = [
    {
      category: 'Security',
      q: "Is my personal tax and financial data secure?",
      a: "Yes, security is our primary focus. All uploaded tax PDFs are processed using AES-256 bank-grade encryption at rest and TLS 1.3 in transit. We run on isolated cloud containers, and your documents are automatically purged from our servers unless you choose to archive them."
    },
    {
      category: 'Documents',
      q: "Which tax document formats are supported by the platform?",
      a: "We fully support Form 16 (Part A & B) PDFs, Annual Information Statement (AIS) PDFs, Tax Credit Statements (Form 26AS), Salary Slips (PDF/JPG), and various Section 80C/80D investment proofs."
    },
    {
      category: 'OCR Tech',
      q: "Can I upload scanned PDFs or photos of tax notices?",
      a: "Yes. Our platform has a layout-aware OCR (Optical Character Recognition) scanner that reads scanned documents, phone photos of notices, and printed sheets. It preserves grid structures and table columns, allowing the AI to audit tax data accurately."
    },
    {
      category: 'Accuracy',
      q: "How accurate is the AI tax review engine?",
      a: "The AI audit engine parses fields with 99.8% precision, validating values against actual Indian tax laws (such as Section 80C caps, HRA lease equations, and tax slabs). While it provides highly reliable compliance advice, we advise using it to assist your final review before submission."
    },
    {
      category: 'Features',
      q: "Can I download and print the audit reports?",
      a: "Yes. Every review generated inside your dashboard can be downloaded as a professional PDF report. The layout is fully print-optimized, automatically hiding web controls and injecting clean page breaks for multi-page client reviews."
    },
    {
      category: 'Audience',
      q: "Who is TaxReview AI designed for?",
      a: "TaxReview AI serves three main groups: 1) Individual tax payers wanting to verify their returns, 2) Tax consultants and CAs looking to automate bulk client audits, and 3) Finance administrators validating employee HRA or tax declaration slips."
    },
    {
      category: 'OCR Tech',
      q: "Is the OCR data extraction fully automatic?",
      a: "Yes. As soon as you upload a document under Client Profiles, the OCR parser extracts values instantly. There are no templates to build or manual fields to link."
    },
    {
      category: 'Security',
      q: "Does the application store my tax portal credentials?",
      a: "No. TaxReview AI does not require, ask for, or store your Income Tax Department e-filing portal passwords. You download your AIS, 26AS, or Notices yourself and upload the PDFs securely to our dashboard."
    },
    {
      category: 'Compliance',
      q: "Is the platform updated for the latest Union Budget changes?",
      a: "Yes. We update our auditing rules and regime slab models as soon as direct tax code changes are announced by the Finance Ministry, keeping computations fully aligned with current rules."
    },
    {
      category: 'Audience',
      q: "Can I use TaxReview AI if I am a freelance business owner?",
      a: "Yes. Freelancers can upload monthly invoices, profit statements, bank ledgers, or credit statements to check tax liabilities and identify capital gains tax or TDS errors."
    },
    {
      category: 'Documents',
      q: "What should I do if the AI highlights a discrepancy in my Form 16?",
      a: "If a mismatch is flagged (such as salary slip EPF or PAN deductor codes not matching Form 26AS ledger entries), you should contact your employer's payroll department to file a quarterly TDS correction statement."
    },
    {
      category: 'Features',
      q: "Can I manage multiple clients under a single CA account?",
      a: "Yes. The client management system is designed to organize multi-client tax dossiers, upload histories, previous reports, and audit timelines under a single dashboard panel."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO 
        title="FAQ - Document Formats, Security, & OCR Support" 
        description="Have questions about TaxReview AI? Find answers regarding data security, supported PDF formats, scanned notice uploads, and PDF print exports."
      />

      {/* Header section */}
      <section className="relative py-16 md:py-24 border-b border-slate-200/50 dark:border-slate-900/50 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] -z-10 h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[100px]" />
        
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Quick, detailed answers regarding our AI audit engine, OCR parser capabilities, and compliance metrics.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              className="block w-full border-0 bg-transparent py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
              placeholder="Search FAQ questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* FAQ Main content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 dark:text-white focus:outline-none"
                    aria-expanded={activeIdx === idx}
                  >
                    <span className="text-xs md:text-sm">{faq.q}</span>
                    <ChevronDown 
                      className={`h-4.5 w-4.5 text-slate-455 transition-transform duration-200 ${activeIdx === idx ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {activeIdx === idx && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                      {faq.a}
                      <span className="inline-block mt-3 text-[9px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit">
                        Topic: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                <HelpCircle className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">No questions found matching your search term.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
