import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import { blogArticles } from './blogData';
import { 
  FileText, 
  UploadCloud, 
  Cpu, 
  Shield, 
  CheckCircle, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  Users, 
  Lock, 
  Layers,
  Sparkles,
  Search,
  Eye,
  Database,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const docs = [
    {
      name: 'Form 16 (Part A & B)',
      issuer: 'Employer (by June 15th)',
      why: 'Baseline of your salary earnings and employer tax deposits.',
      how: 'AI extracts salary components, Section 16 reliefs, and matches total TDS credits.'
    },
    {
      name: 'Annual Information Statement (AIS)',
      issuer: 'Income Tax Department',
      why: 'Tracks savings interest, stocks, dividends, and high-value spends.',
      how: 'AI groups taxable interest dividends and flags mutual fund gains automatically.'
    },
    {
      name: 'Form 26AS',
      issuer: 'TRACES Tax Portal',
      why: 'Confirms that taxes deducted have been successfully deposited.',
      how: 'AI checks TDS quarterly credits and PAN deductor information.'
    },
    {
      name: 'Income Tax Return (ITR)',
      issuer: 'CPC Bangalore / Taxpayer',
      why: 'Proof of income filing for visas, loans, and credit limits.',
      how: 'AI validates gross taxable income declarations and rebate calculations.'
    },
    {
      name: 'Income Tax Notices',
      issuer: 'CPC / Assessing Officers',
      why: 'Indicates defects, demand dues, or non-declaration risks.',
      how: 'AI parses section clauses, flags target gaps, and drafts response notes.'
    },
    {
      name: 'Salary Slips',
      issuer: 'Employer Staff (Monthly)',
      why: 'Tracks EPF, monthly HRA components, and professional tax.',
      how: 'AI extracts basic pay, rent payouts, and calculates monthly exemption potential.'
    },
    {
      name: 'Investment Proofs',
      issuer: 'LIC, Banks, Insurers, Landlords',
      why: 'Reduces taxable income under Chapter VI-A Old Regime.',
      how: 'AI validates policy holders, receipt dates, and maps to Section 80C/80D.'
    }
  ];

  const features = [
    { icon: Cpu, title: 'AI-Powered Review', desc: 'Checks tax declarations against Section 80C, 80D, and rent rules.' },
    { icon: UploadCloud, title: 'OCR Extraction', desc: 'Hybrid grid layout scanner reads scanned notices and salary tables.' },
    { icon: CheckCircle, title: 'Smart Tax Validation', desc: 'Checks math calculations and matches PAN entries.' },
    { icon: Sparkles, title: 'Missing Deduction Detection', desc: 'Highlights unclaimed HRA, insurance, or PF benefits.' },
    { icon: Layers, title: 'Compliance Checks', desc: 'Reconciles entries with default tax laws and slab specifications.' },
    { icon: AlertTriangle, title: 'Risk Detection', desc: 'Flags regimental mismatch errors and audit risks.' },
    { icon: FileText, title: 'Professional Reports', desc: 'Generates detailed client-facing audit reports.' },
    { icon: Clock, title: 'Fast Processing', desc: 'Extracts, audits, and outputs pdf results in under 15 seconds.' },
    { icon: Shield, title: 'Secure Data Handling', desc: 'Employs AES-256 and TLS 1.3 standards to protect private PAN details.' }
  ];

  const steps = [
    { step: '01', title: 'Upload', desc: 'Drag tax forms, notices, or salary sheets securely.' },
    { step: '02', title: 'OCR Extraction', desc: 'Layout-aware scanner reads text and grids.' },
    { step: '03', title: 'AI Analysis', desc: 'Gemini LLM checks values against direct tax codes.' },
    { step: '04', title: 'Risk Detection', desc: 'Flags regime errors and PAN mismatches.' },
    { step: '05', title: 'Recommendation', desc: 'Points out unclaimed deductions and notices.' },
    { step: '06', title: 'Professional Report', desc: 'Generates print-optimized PDF audit sheets.' }
  ];



  const whyChooseUs = [
    { title: 'Faster than Manual Review', desc: 'Replaces hours of spreadsheet comparisons and verification lists with instantaneous automated processing.' },
    { title: 'Higher Accuracy', desc: 'Systematically flags line item discrepancies that manual checkers easily overlook in long AIS sheets.' },
    { title: 'Secure Infrastructure', desc: 'We purge documents regularly and use bank-grade encryption to secure PAN data.' },
    { title: 'Time-saving Automation', desc: 'Allows CAs and accountants to spend time optimizing returns instead of manual cross-verification.' },
    { title: 'Easy to Use', desc: 'Drag-and-drop panel designed for individuals and tax professionals without learning curves.' },
    { title: 'Professional Reporting', desc: 'Outputs print-optimized PDF reports containing executive risk cards and audit tables.' }
  ];

  const faqs = [
    { q: "Is my personal tax and financial data secure?", a: "Yes. All uploaded tax PDFs are processed using AES-256 bank-grade encryption at rest and TLS 1.3 in transit. We run on isolated cloud clusters, and your documents are automatically purged from our servers unless you archive them." },
    { q: "Which tax document formats are supported by the platform?", a: "We support Form 16 (Part A & B), AIS (Annual Information Statement), Form 26AS, Salary Slips, ITR Acknowledgements, Tax Notices, and Section 80C/80D proofs." },
    { q: "Can the OCR read scanned PDFs or mobile photos?", a: "Yes. The platform integrates a layout-aware OCR engine that extracts tabular numbers and texts from low-quality scans, mobile photos, and digital sheets." },
    { q: "How accurate is the tax risk evaluation?", a: "The AI checks numbers against strict Indian Income Tax rules (Old vs New regime slabs, standard deductions, HRA formulas). While highly accurate (99.8%), we recommend using it to assist your final filing review." },
    { q: "Can I download the audit report as a PDF?", a: "Yes. Every document audit renders an executive summary page with risk cards, audit findings, and a fully print-friendly PDF generation layout." },
    { q: "Who is TaxReview AI designed for?", a: "It serves individuals checking their own files, tax consultants and CAs automating bulk audits, and corporate administrators validating tax declarations." },
    { q: "Does the application store my tax portal credentials?", a: "No. We do not require, ask for, or store your Income Tax Department e-filing portal passwords." },
    { q: "Is the OCR data extraction fully automatic?", a: "Yes. As soon as you upload a document under Client Profiles, the OCR parser extracts values instantly." },
    { q: "Does the system support multiple financial years?", a: "Yes. The AI is updated to handle tax codes across different assessment years, validating old vs new regime rules appropriately." },
    { q: "What happens if there is an error in document parsing?", a: "Our system will flag a parsing status error and direct you to re-upload. You can also edit client information manually." },
    { q: "Is there any software to download?", a: "No, TaxReview AI is a 100% web-based application. You can access it securely from any desktop or mobile browser." },
    { q: "Can I use it for business audit files?", a: "Yes. Tax consultants and accountants use the platform to organize multi-client dossiers and audit files." }
  ];

  // Homepage Schema for SEO
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TaxReview AI",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "AI-Powered Income Tax Review System. Audits Form 16, AIS, Form 26AS, and tax notices instantly.",
    "url": SITE_URL,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      <SEO 
        title="AI-Powered Income Tax Review System" 
        description="Automate tax audits, scan Form 16, AIS, or tax notices, find missing deductions, and export professional PDF report summaries using TaxReview AI."
        schema={homepageSchema}
      />

      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-28">
        {/* Modern background glows */}
        <div className="absolute top-[20%] left-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/5 blur-[130px] pointer-events-none" />

        {/* Floating document animations */}
        <div className="hidden lg:block absolute left-[8%] top-[30%] h-12 w-12 rounded-xl bg-white/40 dark:bg-slate-900/40 p-2.5 shadow-lg border border-slate-200/50 dark:border-slate-800/50 animate-bounce select-none pointer-events-none">
          <FileText className="h-full w-full text-indigo-500" />
        </div>
        <div className="hidden lg:block absolute right-[8%] top-[25%] h-14 w-14 rounded-2xl bg-white/40 dark:bg-slate-900/40 p-3 shadow-xl border border-slate-200/50 dark:border-slate-800/50 animate-pulse select-none pointer-events-none" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-full w-full text-primary-500" />
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-primary-500/30 bg-primary-500/5 px-4 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Premium AI Tax Auditing Suite</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white leading-[1.1]">
              AI-Powered Income Tax <br />
              <span className="bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Review & Audit System
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Instantly audit Form 16, AIS, Form 26AS, and tax notices. Detect compliance risks, discover unclaimed deductions, and generate audit reports in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {user ? (
                <Link
                  to="/"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/features"
                    className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-200 bg-white/40 backdrop-blur px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900 transition-all"
                  >
                    View Features
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Interactive CSS Dashboard Preview Mockup (Tabbed Showcase) */}
          <div className="mt-16 md:mt-20 relative mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur animate-scale-up">
            
            {/* Browser chrome header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3.5 px-3">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-400 block" />
                <span className="h-3 w-3 rounded-full bg-amber-400 block" />
                <span className="h-3 w-3 rounded-full bg-green-400 block" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-950 px-8 py-1 rounded-md text-[10px] text-slate-400 font-mono tracking-tight select-none">
                {SITE_URL}/dashboard/{activeTab}
              </div>
              <div className="w-12" />
            </div>

            {/* Tab controls */}
            <div className="flex border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 px-3 py-2 overflow-x-auto gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Layers },
                { id: 'clients', label: 'Client Management', icon: Users },
                { id: 'upload', label: 'Upload Screen', icon: UploadCloud },
                { id: 'report', label: 'Review Report', icon: FileText }
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 border border-slate-200/60 dark:border-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab view viewport */}
            <div className="pt-6 px-3 min-h-[380px] flex flex-col justify-between">
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in select-none">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Main Control Center</h3>
                      <p className="text-[10px] text-slate-400">Overview of recent audits and client listings</p>
                    </div>
                    <span className="rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-3 py-1 text-[10px] font-bold flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>System Online</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40">
                      <span className="text-[10px] text-slate-400 block mb-1">Total Audits</span>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-200">142</span>
                    </div>
                    <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40">
                      <span className="text-[10px] text-slate-400 block mb-1">Accuracy Score</span>
                      <span className="text-lg font-bold text-green-500">99.8%</span>
                    </div>
                    <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40">
                      <span className="text-[10px] text-slate-400 block mb-1">Alerts Found</span>
                      <span className="text-lg font-bold text-amber-500">12 Pending</span>
                    </div>
                  </div>

                  <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden text-[10px] bg-white dark:bg-slate-900/40">
                    <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-500">
                      Audit Action Log
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="p-3.5 flex justify-between items-center">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Form 16 scanned for Aditi Sharma</span>
                        <span className="text-slate-400">10 mins ago</span>
                      </div>
                      <div className="p-3.5 flex justify-between items-center">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Notice response drafted for Amit Patel</span>
                        <span className="text-slate-400">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'clients' && (
                <div className="space-y-6 animate-fade-in select-none">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Client Management Dossiers</h3>
                      <p className="text-[10px] text-slate-400">Organize profiles, upload logs, and audit files</p>
                    </div>
                    <button className="bg-primary-600 text-white rounded-xl px-3.5 py-1.5 text-[10px] font-bold shadow shadow-primary-500/25">
                      + Add Client
                    </button>
                  </div>

                  <div className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/40 text-[10px]">
                    <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-950 px-4 py-3 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-500">
                      <div className="col-span-4">Client Name</div>
                      <div className="col-span-4">PAN</div>
                      <div className="col-span-4">Status</div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      <div className="grid grid-cols-12 px-4 py-3.5 items-center">
                        <div className="col-span-4 font-semibold text-slate-700 dark:text-slate-300">Aditi Sharma</div>
                        <div className="col-span-4 text-slate-400 font-mono">ABCPS1234F</div>
                        <div className="col-span-4"><span className="bg-green-100 dark:bg-green-950/20 text-green-500 px-2 py-0.5 rounded-full font-bold">Audited</span></div>
                      </div>
                      <div className="grid grid-cols-12 px-4 py-3.5 items-center">
                        <div className="col-span-4 font-semibold text-slate-700 dark:text-slate-300">Rahul Verma</div>
                        <div className="col-span-4 text-slate-450 font-mono">XYZPV9876K</div>
                        <div className="col-span-4"><span className="bg-amber-100 dark:bg-amber-950/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">Action Required</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-6 animate-fade-in select-none">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Secure Document Uploader</h3>
                    <p className="text-[10px] text-slate-400">OCR layout parser extracts text instantly</p>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-slate-50/30 dark:bg-slate-950/20 flex flex-col items-center justify-center space-y-3 cursor-pointer">
                    <UploadCloud className="h-10 w-10 text-primary-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag and drop tax PDF file here</span>
                      <p className="text-[10px] text-slate-500 mt-1">Supports Form 16, AIS, notices, or salary sheets</p>
                    </div>
                    <span className="border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1 bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-500 shadow-sm">
                      Select File
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'report' && (
                <div className="space-y-6 animate-fade-in select-none">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Audit Report summary</h3>
                      <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wider mt-1 text-primary-600 dark:text-primary-400">Aditi Sharma - FY 2024-25</p>
                    </div>
                    <button className="bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-[10px] font-bold text-slate-500 rounded-xl px-3 py-1.5 shadow-sm">
                      Download PDF
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-red-500/5 dark:bg-red-500/10 border-l-4 border-l-red-500 space-y-2">
                    <div className="flex items-center space-x-2 text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs font-bold">Employer TDS Deduction Mismatch</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      TDS declared under salary slip sum does not match the quarterly deposits reflected inside Form 26AS. Potential discrepancy equals ₹14,200.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Trusted Documents Section */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Trusted Document Coverage</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Supported Indian Tax Forms</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              See what documents you can parse, who issues them, and how the AI runs layout validation on each file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docs.map((doc, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 p-2">
                      <FileText className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{doc.name}</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">Who Issues It</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{doc.issuer}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1">Why It Matters</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300 block leading-relaxed">{doc.why}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-1.5">How AI Audits It</span>
                      <span className="font-semibold text-primary-600 dark:text-primary-400 block bg-primary-50/40 dark:bg-primary-950/20 p-3 rounded-2xl border border-primary-100/50 dark:border-primary-900/30 leading-relaxed">{doc.how}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/supported-documents" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1.5">
              <span>View Detailed Document Coverage</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How TaxReview AI Works (6-step timeline) */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Audit Process</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">How TaxReview AI Audits Documents</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              We process unstructured files and run complex tax code validation rules in 6 secure steps.
            </p>
          </div>

          {/* 6-Step Horizontal Scrollable Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            <div className="absolute top-[35px] left-[40px] right-[40px] h-0.5 bg-slate-100 dark:bg-slate-850 hidden lg:block z-0" />

            {steps.map((step, idx) => (
              <div key={idx} className="space-y-4 relative z-10 text-center lg:text-left">
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 shadow shadow-slate-100 flex items-center justify-center text-xs font-extrabold text-primary-600 dark:bg-slate-900 dark:border-slate-800 dark:text-primary-400 dark:shadow-none mx-auto lg:mx-0">
                  {step.step}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[150px] mx-auto lg:mx-0">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid (9 features) */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Capabilities</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Features</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Discover how our system handles OCR extraction, regime verification, risk finding, and security parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm hover:translate-y-[-2px] transition-all duration-300 flex gap-4"
                >
                  <div className="p-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 h-fit">
                    <IconComp className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/features" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1.5">
              <span>Explore All Feature Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose TaxReview AI (6 benefits) */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Why Us</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Why Choose TaxReview AI</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              We leverage direct tax logic and bounding-box layout parsing to maximize efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((benefit, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-2.5 bg-white dark:bg-slate-900 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10 text-green-500 font-bold text-[10px]">
                    ✓
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Core Highlights Section */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-b border-slate-900">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[800px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block">System Highlights</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Platform Core Capabilities
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
              Explore the core technical architecture and features powering the TaxReview AI intelligence engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: AI-Powered Tax Review */}
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30 hover:bg-slate-900/60 group">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">AI-Powered Tax Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Intelligent review of income tax documents using AI models to cross-examine schedules and claim eligibility.
              </p>
            </div>

            {/* Card 2: OCR Document Extraction */}
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900/60 group">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">OCR Document Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically extracts structured tabular information and coordinates from uploaded tax declarations and slips.
              </p>
            </div>

            {/* Card 3: Professional Audit Reports */}
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-slate-900/60 group">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Professional Audit Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates clean, downloadable PDF audit reports with formatted compliance warnings, next steps, and figures.
              </p>
            </div>

            {/* Card 4: Secure MERN Platform */}
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-slate-900/60 group">
              <div className="mb-4 inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-2">Secure MERN Platform</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built with React, Node.js, Express, MongoDB, and cryptographically secure JWT role-based session authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Insights</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Recent Tax Insights</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Read guides and articles prepared by tax consultants on direct tax compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.slice(0, 3).map((article) => (
              <article 
                key={article.slug} 
                className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    <Link to={`/blog/${article.slug}`} className="hover:text-primary-500 transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[9px] text-slate-450 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{article.date}</span>
                  </span>
                  <Link 
                    to={`/blog/${article.slug}`} 
                    className="text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/blog" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1.5">
              <span>View All Blog Articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Preview accordion */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Support FAQ</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Quick answers to common questions about file formats, parsing checks, and data compliance.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {faqs.slice(0, 6).map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between py-2 text-left font-semibold text-xs md:text-sm hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none transition-colors"
                  aria-expanded={activeFaq === idx}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    className={`h-4 w-4 text-slate-450 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} 
                  />
                </button>
                {activeFaq === idx && (
                  <p className="mt-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-6 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1">
              <span>View All 12 FAQ Queries</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-primary-950 p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-[-50%] right-[-20%] h-[350px] w-[350px] rounded-full bg-primary-500/10 blur-[90px] pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-extrabold">Ready to Automate Your Tax Review Workflow?</h2>
              <p className="text-xs md:text-sm text-slate-450 leading-relaxed">
                Join tax professionals, accountants, and individual taxpayers using TaxReview AI to flag discrepancies, audit Form 16 sheets, and verify notice issues.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-indigo-500 text-white rounded-xl px-8 py-3.5 text-xs font-bold shadow-lg shadow-primary-500/20 hover:opacity-95 transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto border border-slate-800 text-slate-300 rounded-xl px-8 py-3.5 text-xs font-bold hover:bg-slate-900/60 transition-all"
                >
                  Access Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
