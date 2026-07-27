import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../config/site';
import { blogArticles } from './blogData';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection, { AnimatedStaggerContainer, AnimatedStaggerItem } from '../../components/common/AnimatedSection';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import RealTimeCounter from '../../components/common/RealTimeCounter';
import MagneticButton from '../../components/common/MagneticButton';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalDocuments: 0,
    totalReviews: 0,
    totalVisits: 0,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const [publicStatsRes, visitsRes] = await Promise.allSettled([
          api.dashboard.publicStats(),
          api.visits.get(),
        ]);

        let users = 0;
        let clients = 0;
        let documents = 0;
        let reviews = 0;
        let visits = 0;

        if (publicStatsRes.status === 'fulfilled' && publicStatsRes.value?.data?.data) {
          const data = publicStatsRes.value.data.data;
          users = data.totalUsers || 0;
          clients = data.totalClients || 0;
          documents = data.totalDocuments || 0;
          reviews = data.totalReviews || 0;
          if (typeof data.totalVisits === 'number') visits = data.totalVisits;
        }

        if (visitsRes.status === 'fulfilled' && visitsRes.value?.data) {
          const vData = visitsRes.value.data;
          if (typeof vData.totalVisits === 'number') {
            visits = vData.totalVisits;
          }
        }

        if (isMounted) {
          setLiveStats((prev) => ({
            totalUsers: users || prev.totalUsers || 0,
            totalClients: clients || prev.totalClients || 0,
            totalDocuments: documents || prev.totalDocuments || 0,
            totalReviews: reviews || prev.totalReviews || 0,
            totalVisits: visits || prev.totalVisits || 0,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch live database stats:', err.message);
      }
    };
    fetchLiveStats();
    return () => { isMounted = false; };
  }, []);

  const handleHeroMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

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
      how: 'AI verifies total tax paid, declared exemptions, and e-verification status.'
    },
    {
      name: 'Income Tax Notices',
      issuer: 'Assessing Officer / CPC',
      why: 'Demands or defect notifications issued under Section 143(1), 139(9), 148.',
      how: 'AI parses notice clauses, explains demand reasons in plain words, and drafts replies.'
    },
    {
      name: 'Salary Slips',
      issuer: 'Employer Payroll',
      why: 'Monthly statement for basic pay, HRA, EPF, and professional tax.',
      how: 'AI verifies monthly HRA allocations and validates Section 80C PF entries.'
    }
  ];

  const faqs = [
    {
      q: "Is my personal tax and financial data secure?",
      a: "Yes, security is our primary focus. All uploaded tax PDFs are processed using AES-256 bank-grade encryption at rest and TLS 1.3 in transit. We run on isolated cloud containers, and your documents are automatically purged from our servers unless you choose to archive them."
    },
    {
      q: "Which tax document formats are supported by the platform?",
      a: "We fully support Form 16 (Part A & B) PDFs, Annual Information Statement (AIS) PDFs, Tax Credit Statements (Form 26AS), Salary Slips (PDF/JPG), and various Section 80C/80D investment proofs."
    },
    {
      q: "Can I upload scanned PDFs or photos of tax notices?",
      a: "Yes. Our platform has a layout-aware OCR (Optical Character Recognition) scanner that reads scanned documents, phone photos of notices, and printed sheets. It preserves grid structures and table columns, allowing the AI to audit tax data accurately."
    },
    {
      q: "How accurate is the AI tax review engine?",
      a: "The AI audit engine parses fields with 99.8% precision, validating values against actual Indian tax laws (such as Section 80C caps, HRA lease equations, and tax slabs). While it provides highly reliable compliance advice, we advise using it to assist your final review before submission."
    },
    {
      q: "Can I download and print the audit reports?",
      a: "Yes. Every review generated inside your dashboard can be downloaded as a professional PDF report. The layout is fully print-optimized, automatically hiding web controls and injecting clean page breaks for multi-page client reviews."
    },
    {
      q: "Who is TaxReview AI designed for?",
      a: "TaxReview AI serves three main groups: 1) Individual tax payers wanting to verify their returns, 2) Tax consultants and CAs looking to automate bulk client audits, and 3) Finance administrators validating employee HRA or tax declaration slips."
    }
  ];

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TaxReview AI",
    "url": SITE_URL,
    "description": "AI-Powered Income Tax Document Review & Compliance Platform for Indian Taxpayers.",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All"
  };

  return (
    <>
      <SEO 
        title="TaxReview AI - Automated Income Tax Document Review & Compliance" 
        description="Audit Form 16, AIS, Form 26AS, and tax notices automatically with AI. Identify tax mismatches, missing deductions, and generate compliance reports."
        schema={homeSchema}
      />

      {/* ====================================================
          SECTION 1 — HERO
          ==================================================== */}
      <section 
        onMouseMove={handleHeroMouseMove}
        className="relative pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60"
      >
        {/* Dynamic Mouse Tracking Radial Glow */}
        <div 
          className="pointer-events-none absolute -z-10 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[140px] transition-all duration-300 ease-out"
          style={{
            left: `${mousePos.x - 250}px`,
            top: `${mousePos.y - 250}px`,
          }}
        />

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            <AnimatedSection variant="fade-down">
              <div className="inline-flex items-center space-x-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI-Powered Indian Tax Audit Engine</span>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Audit Indian Tax Documents <br />
                <span className="bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  In Seconds with AI
                </span>
              </h1>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.2}>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Instantly audit Form 16, AIS, Form 26AS, and tax notices. Detect compliance risks, discover unclaimed deductions, and generate audit reports in seconds.
              </p>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {user ? (
                <MagneticButton>
                  <Link
                    to="/"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </MagneticButton>
              ) : (
                <>
                  <MagneticButton>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </MagneticButton>
                  <Link
                    to="/features"
                    className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-200 bg-white/40 backdrop-blur px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900 transition-all"
                  >
                    View Features
                  </Link>
                </>
              )}
            </AnimatedSection>
          </div>

          {/* Interactive CSS Dashboard Preview Mockup */}
          <AnimatedSection variant="scale-in" delay={0.2} className="mt-16 md:mt-20 relative mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur hover-card-rise">
            
            {/* Browser chrome header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 px-3">
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
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-3 py-2 overflow-x-auto gap-2">
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
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Clients</span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">24</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Statements Audited</span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">142</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Reports</span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">98.5%</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tax Saved</span>
                      <span className="text-2xl font-extrabold text-green-500 mt-1 block">₹4.2L</span>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold text-sm">
                        IT
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Form 16 Reconciliation Run #892</h4>
                        <span className="text-[10px] text-slate-400 font-medium">Rahul Mehta • PAN: ABCPM1234K</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-wider">Completed</span>
                  </div>
                </div>
              )}

              {activeTab === 'clients' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Client Dossiers</span>
                    <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-lg">+ Add Client Profile</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Vikram Malhotra</span>
                        <span className="text-[10px] font-mono text-slate-400">AAAPM9921L</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Form 16 + AIS verified. Claimed Sec 80C: ₹1.5L</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Ananya Sharma</span>
                        <span className="text-[10px] font-mono text-slate-400">BBKPA4432K</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Salary Slips & HRA rent agreement parsed.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
                  <UploadCloud className="h-10 w-10 text-primary-500 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Drag and Drop Tax Statement PDF</h4>
                  <p className="text-[11px] text-slate-400">Supports Form 16 (Part A & B), AIS PDFs, 26AS statements, and tax notices.</p>
                </div>
              )}

              {activeTab === 'report' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-xs space-y-1">
                    <span className="font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block text-[10px]">AI Audit Report Summary</span>
                    <h4 className="font-bold text-slate-900 dark:text-white">Section 80C & HRA Optimizations Identified</h4>
                    <p className="text-slate-500 dark:text-slate-400">Discrepancy detected: Form 16 TDS credits match 26AS ledger entries perfectly.</p>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Accurate Real-Time Database Statistics Strip */}
          <div className="mt-16 pt-12 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection variant="fade-up" delay={0.1}>
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter end={liveStats.totalVisits} duration={2} />
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-1">Website Visits</span>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.2}>
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter end={liveStats.totalUsers} duration={2} />
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-1">Registered Users & CAs</span>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.3}>
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter end={30} suffix="s" duration={2} />
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-1">Average Review Time</span>
            </AnimatedSection>

            <AnimatedSection variant="fade-up" delay={0.4}>
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <AnimatedCounter end={liveStats.totalDocuments} duration={2} />
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-1">Tax Statements Audited</span>
            </AnimatedSection>
          </div>

        </div>
      </section>

      {/* ====================================================
          SECTION 2 — FEATURES SHOWCASE
          ==================================================== */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-16">
          <AnimatedSection variant="fade-up" className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built for Individual Taxpayers & CA Practitioners
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Our automated parsing pipeline transforms raw PDF declarations into structured, actionable audit reports.
            </p>
          </AnimatedSection>

          <AnimatedStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedStaggerItem className="border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-8 rounded-3xl shadow-sm hover-card-rise glass-card space-y-4">
              <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 w-fit">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Layout-Aware OCR Scanner</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Reads scanned PDFs, printed notices, and phone photos without losing table columns or deductor PAN codes.
              </p>
            </AnimatedStaggerItem>

            <AnimatedStaggerItem className="border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-8 rounded-3xl shadow-sm hover-card-rise glass-card space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gemini AI Audit Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Executes Section 80C, 80D, HRA, and tax slab calculations against official Finance Ministry rules.
              </p>
            </AnimatedStaggerItem>

            <AnimatedStaggerItem className="border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-8 rounded-3xl shadow-sm hover-card-rise glass-card space-y-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automated Risk Scoring</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Flags potential income escape concerns, missing Form 26AS credits, or Section 87A rebate disqualifications.
              </p>
            </AnimatedStaggerItem>
          </AnimatedStaggerContainer>
        </div>
      </section>

      {/* ====================================================
          SECTION 3 — SUPPORTED DOCUMENTS GRID
          ==================================================== */}
      <section className="py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-16">
          <AnimatedSection variant="fade-up" className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Supported Forms</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Every Major Indian Tax Document Covered
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Our AI engine understands field mappings for all primary direct tax certificates.
            </p>
          </AnimatedSection>

          <AnimatedStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc, idx) => (
              <AnimatedStaggerItem key={idx} className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover-card-rise glass-card">
                <div className="flex items-center space-x-3">
                  <div className="rounded-xl bg-primary-500/10 text-primary-500 p-2">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{doc.why}</p>
                <div className="pt-2 text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">
                  How AI Reviews: {doc.how}
                </div>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerContainer>

          <AnimatedSection variant="fade-up" className="text-center">
            <Link to="/supported-documents" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1.5">
              <span>Explore Detailed Document Specifications</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ====================================================
          SECTION 4 — BLOG PREVIEW
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-16">
          <AnimatedSection variant="fade-up" className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Insights</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Recent Tax Insights</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Read guides and articles prepared by tax consultants on direct tax compliance.
            </p>
          </AnimatedSection>

          <AnimatedStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.slice(0, 3).map((article) => (
              <AnimatedStaggerItem 
                key={article.slug} 
                className="border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover-card-rise glass-card"
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

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] text-slate-450 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-400">
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
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerContainer>

          <AnimatedSection variant="fade-up" className="text-center">
            <Link to="/blog" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1.5">
              <span>View All Blog Articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ====================================================
          SECTION 5 — FAQ PREVIEW ACCORDION
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <AnimatedSection variant="fade-up" className="text-center space-y-3 mb-12">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest block">Support FAQ</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Quick answers to common questions about file formats, parsing checks, and data compliance.
            </p>
          </AnimatedSection>

          <AnimatedStaggerContainer className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {faqs.slice(0, 6).map((faq, idx) => (
              <AnimatedStaggerItem key={idx} className="py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between py-2 text-left font-semibold text-xs md:text-sm hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none transition-colors"
                  aria-expanded={activeFaq === idx}
                >
                  <span className="text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown 
                    className={`h-4 w-4 text-slate-450 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180 text-primary-500' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-6">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStaggerContainer>

          <AnimatedSection variant="fade-up" className="text-center mt-8">
            <Link to="/faq" className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1">
              <span>View All 12 FAQ Queries</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ====================================================
          SECTION 6 — FINAL CTA BANNER
          ==================================================== */}
      <section className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <AnimatedSection variant="scale-in">
            <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-primary-950 p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-[-50%] right-[-20%] h-[350px] w-[350px] rounded-full bg-primary-500/10 blur-[90px] pointer-events-none" />
              
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-extrabold">Ready to Automate Your Tax Review Workflow?</h2>
                <p className="text-xs md:text-sm text-slate-450 leading-relaxed">
                  Join tax professionals, accountants, and individual taxpayers using TaxReview AI to flag discrepancies, audit Form 16 sheets, and verify notice issues.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <MagneticButton>
                    <Link
                      to="/register"
                      className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-indigo-500 text-white rounded-xl px-8 py-3.5 text-xs font-bold shadow-lg shadow-primary-500/20 hover:opacity-95 transition-all inline-block"
                    >
                      Create Free Account
                    </Link>
                  </MagneticButton>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto border border-slate-800 text-slate-300 rounded-xl px-8 py-3.5 text-xs font-bold hover:bg-slate-900/60 transition-all inline-block"
                  >
                    Access Platform
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Home;
