import React from 'react';
import SEO from '../../components/SEO';

const Privacy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy - Data Security & PAN Protection" 
        description="Review the TaxReview AI Privacy Policy. Learn about our strict document purge terms, AES-256 encryption, and PAN safety regulations."
      />

      <section className="py-16 md:py-24 max-w-[800px] mx-auto px-4 md:px-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">Last updated: July 15, 2026</p>

        <div className="text-sm md:text-[17px] text-slate-600 dark:text-slate-300 space-y-6 leading-[1.8] text-justify hyphens-auto">
          <p>
            At TaxReview AI, we treat the security of your tax files, Permanent Account Number (PAN), and income declarations as our highest priority. This Privacy Policy details how we collect, process, and protect your data.
          </p>

          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pt-4 text-left">1. Information We Collect</h2>
          <p>
            We collect your email and name when creating an account. When you upload PDFs (Form 16, AIS, notices, salary sheets), our OCR extractor parses the document contents to perform auditing checks. We do not gather or store e-filing portal passwords.
          </p>

          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pt-4 text-left">2. Processing & Storage</h2>
          <p>
            All uploaded document data is processed on secure cloud containers. The extracted fields are strictly mapped to perform audit rules. We keep your file data isolated on database collections. Document archives can be manually deleted from your dashboard history at any time.
          </p>

          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pt-4 text-left">3. Security Controls</h2>
          <p>
            We implement TLS 1.3 transit encryption and AES-256 state database encryption to safeguard files. Our infrastructure runs on secure parameters to ensure that no third party can access PAN or income records.
          </p>

          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pt-4 text-left">4. Compliance Contact</h2>
          <p>
            If you have questions regarding data retention, compliance purging, or wish to request immediate profile termination, please contact our privacy compliance officer at support@taxreviewai.com.
          </p>
        </div>
      </section>
    </>
  );
};

export default Privacy;
