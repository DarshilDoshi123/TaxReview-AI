import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <SEO 
        title="404 - Page Audited Out" 
        description="The requested page could not be found. Return to TaxReview AI to audit Form 16, AIS, or Notice sheets."
      />

      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden select-none">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-red-500/5 blur-[90px] dark:bg-red-500/10" />

        <div className="text-center space-y-6 max-w-md mx-auto animate-scale-up">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Deduction Mismatch</span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">404: Page Audited Out</h1>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed max-w-xs mx-auto pt-2">
              The page section you are trying to claim does not exist or has been archived from e-filing parameters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 items-center justify-center">
            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
