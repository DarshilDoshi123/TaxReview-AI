import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import AnimatedSection, { AnimatedStaggerContainer, AnimatedStaggerItem } from '../../components/common/AnimatedSection';
import MagneticButton from '../../components/common/MagneticButton';
import { 
  Cpu, 
  UploadCloud, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Clock, 
  CheckCircle,
  Layers,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const coreFeatures = [
    {
      icon: Cpu,
      title: 'AI Powered Review',
      desc: 'Checks client declarations against Section 80C, 80D, standard relief, and rent calculations, validating numbers against actual direct tax codes.'
    },
    {
      icon: UploadCloud,
      title: 'OCR Extraction',
      desc: 'Advanced layout-aware scanner parses scanned notices and salary slip grids, keeping row and column relationships aligned.'
    },
    {
      icon: CheckCircle,
      title: 'Smart Tax Validation',
      desc: 'Audits forms for calculation errors, arithmetic inconsistencies, and mismatched PAN inputs automatically.'
    },
    {
      icon: Sparkles,
      title: 'Missing Deduction Detection',
      desc: 'Scans investment statements and payslips to discover unclaimed tax exemptions (like health insurance or employee PF credits).'
    },
    {
      icon: Layers,
      title: 'Compliance Checks',
      desc: 'Systematically validates inputs against regimental slabs and deduction limits to prevent e-filing discrepancies.'
    },
    {
      icon: AlertTriangle,
      title: 'Risk Detection',
      desc: 'Flags mismatch hazards between Form 16, AIS, and Form 26AS reports, pre-alerting you to notice risks.'
    },
    {
      icon: FileText,
      title: 'Professional Reports',
      desc: 'Generates detailed client-facing summary audit sheets. Includes structured warning logs and print-friendly stylesheets.'
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      desc: 'Layout-aware extraction, LLM compliance audits, and pdf report generation complete in less than 15 seconds.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Data Handling',
      desc: 'Protects critical PAN details with AES-256 database encryption, TLS 1.3 transit standards, and automated document purge cycles.'
    }
  ];

  return (
    <>
      <SEO 
        title="Features - AI Tax Auditor & OCR Extraction" 
        description="Explore the features of TaxReview AI. Learn about our Gemini tax auditing engine, hybrid OCR document parser, risk flag scanner, and PDF reports."
      />

      {/* Hero Banner */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/40">
        <div className="absolute top-[20%] right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[140px] animate-glow-pulse" />
        
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center space-y-6">
          <AnimatedSection variant="fade-up">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest block mb-2">Capabilities</span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-slate-900 dark:text-white">
              Smarter Tax Reviewing, <span className="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">Powered by AI</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection variant="fade-up" delay={0.15}>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              Discover how TaxReview AI replaces hours of manual sheet matching, calculation audits, and notice reading with automated intelligence.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <AnimatedStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <AnimatedStaggerItem 
                  key={idx} 
                  className="border border-slate-200/80 bg-white/70 dark:border-slate-800/80 dark:bg-slate-900/70 p-6 md:p-8 rounded-3xl shadow-sm hover-card-rise glass-card flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 w-fit">
                      <IconComp className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
                    <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </AnimatedStaggerItem>
              );
            })}
          </AnimatedStaggerContainer>
        </div>
      </section>

      {/* Feature Deep Dive (OCR and Gemini) */}
      <section className="py-16 md:py-20 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* OCR Illustration Mockup */}
            <AnimatedSection variant="fade-right">
              <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-xl space-y-6 hover-card-rise glass-card">
                <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                  <UploadCloud className="h-5 w-5 text-primary-500" />
                  <span>Advanced OCR & Layout Preservation</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800/80 font-mono text-[9px] text-slate-400">
                    <div className="text-green-500 font-bold">// PDF Stream Scanned ...</div>
                    <div>1. Matching bounding box grids for tabular deductions.</div>
                    <div>2. Parsing "Part B - Gross Salary" &rarr; Found ₹8,45,200.</div>
                    <div>3. Parsing "Section 10 Exemptions" &rarr; Found HRA ₹42,000.</div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Unlike basic parser scripts, our hybrid OCR engine extracts exact grid positions from tabular tax files, keeping number relationships clean for auditing.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* AI Auditor explanation */}
            <AnimatedSection variant="fade-left" className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Gemini-Powered Tax Code Auditing
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                By passing normalized PDF structures into LLM-driven tax prompts, our system evaluates complex compliance queries:
              </p>
              <ul className="space-y-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                  <span>Is HRA deduction correctly calculated according to Section 10(13A)?</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                  <span>Are employer TDS summaries matched with Form 26AS credits?</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                  <span>Does the old or new regime offer greater savings for this income?</span>
                </li>
              </ul>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <AnimatedSection variant="scale-in">
            <div className="rounded-3xl bg-gradient-to-tr from-slate-900 to-indigo-950 p-8 md:p-12 text-center text-white border border-slate-800 shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Start Auditing Tax PDFs Safely Today</h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto mb-6">
                Create an account to upload your files, manage client profiles, and run high-accuracy AI reviews in seconds.
              </p>
              <MagneticButton>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center space-x-2 rounded-xl bg-primary-600 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary-500/25 hover:opacity-95 transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Features;
