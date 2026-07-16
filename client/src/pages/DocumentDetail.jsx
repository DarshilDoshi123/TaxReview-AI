import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FileText, 
  User, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Printer, 
  RefreshCw, 
  BadgeHelp,
  ShieldAlert,
  Download,
  Info
} from 'lucide-react';

const DocumentDetail = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('findings');

  const fetchReviewDetails = async () => {
    try {
      const docRes = await api.documents.get(id);
      setDoc(docRes.data.data);
      
      const reviewRes = await api.reviews.get(id);
      setReview(reviewRes.data.data);
    } catch (err) {
      console.error('Error fetching review details:', err);
      toast.error('Failed to load review report details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewDetails();
  }, [id]);

  const handleRegenerate = async () => {
    if (!review) return;
    setRegenerating(true);
    const toastId = toast.loading('Re-analyzing document with Gemini AI...');
    try {
      const response = await api.reviews.regenerate(review._id);
      setReview(response.data.data);
      toast.success('Tax review report regenerated successfully!', { id: toastId });
    } catch (err) {
      toast.error('Regeneration failed. Using cached report.', { id: toastId });
    } finally {
      setRegenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="h-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">Document Report Not Found</h3>
        <p className="mt-1 text-sm text-slate-500 font-medium">Verify the path link or try uploading the document again.</p>
        <Link to="/clients" className="mt-4 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-500">
          Back to Client Directory
        </Link>
      </div>
    );
  }

  // Handle case where review is not ready yet
  if (!review) {
    const isPending = doc.reviewStatus === 'Pending';
    const isProcessing = doc.reviewStatus === 'Processing';
    const isFailed = doc.reviewStatus === 'Failed';

    return (
      <div className="bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-10 max-w-2xl mx-auto text-center space-y-8 animate-fade-in shadow-xl backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Tax Audit in Progress</h3>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            We are extracting data structures and compiling tax auditing models. This typically takes 10 to 15 seconds.
          </p>
        </div>

        {/* Steps Flow Display */}
        <div className="relative flex items-center justify-between max-w-lg mx-auto pt-4">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-100 dark:bg-slate-800 z-0" />
          <div 
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-indigo-600 transition-all duration-500 z-0"
            style={{ 
              width: isPending ? '33%' : isProcessing ? '66%' : isFailed ? '0%' : '100%' 
            }}
          />

          {/* Step 1: Upload */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-white font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md shadow-primary-500/25">
              ✓
            </div>
            <span className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Uploaded</span>
          </div>

          {/* Step 2: Parsing */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md transition-all duration-300 ${
              isPending 
                ? 'bg-gradient-to-tr from-primary-500 to-indigo-600 text-white animate-pulse shadow-primary-500/25' 
                : isProcessing 
                  ? 'bg-gradient-to-tr from-primary-500 to-indigo-600 text-white shadow-primary-500/25' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50'
            }`}>
              {isPending ? '2' : '✓'}
            </div>
            <span className={`mt-2.5 text-[10px] font-bold uppercase tracking-wider ${isPending ? 'text-primary-500' : 'text-slate-400'}`}>Parsing PDF</span>
          </div>

          {/* Step 3: AI Analysis */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md transition-all duration-300 ${
              isProcessing 
                ? 'bg-gradient-to-tr from-primary-500 to-indigo-600 text-white animate-pulse shadow-primary-500/25' 
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50'
            }`}>
              3
            </div>
            <span className={`mt-2.5 text-[10px] font-bold uppercase tracking-wider ${isProcessing ? 'text-primary-500' : 'text-slate-400'}`}>AI Review</span>
          </div>

          {/* Step 4: Finished */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50 font-bold text-xs ring-4 ring-white dark:ring-slate-900">
              4
            </div>
            <span className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</span>
          </div>
        </div>

        {/* Failed state alerts */}
        {isFailed && (
          <div className="p-4.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl flex items-start space-x-3 max-w-md mx-auto text-left">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Review Processing Failed</h4>
              <p className="text-xs font-medium mt-1 leading-relaxed text-slate-500 dark:text-slate-400">The document formatting might have failed extraction or the processing model timed out. Try triggering the run again below.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-3.5 pt-4">
          <button
            onClick={fetchReviewDetails}
            className="flex items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition active:scale-950 duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Check Status</span>
          </button>
          
          {(isFailed || isPending) && (
            <button
              onClick={() => {
                const toastId = toast.loading('Retriggering AI analysis...');
                api.reviews.analyze(doc._id)
                  .then(() => {
                    toast.success('AI Audit successfully completed!', { id: toastId });
                    fetchReviewDetails();
                  })
                  .catch((err) => {
                    toast.error('AI analysis failed. Try offline fallback.', { id: toastId });
                    fetchReviewDetails();
                  });
              }}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-600 hover:to-indigo-600 shadow-md shadow-primary-500/25 transition hover:scale-[1.01] active:scale-950 duration-200"
            >
              <span>Force Start Review</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const { incomeSummary, taxesPaid, deductions, missingDeductions, missingDocuments, issues, recommendations, riskLevel } = review;

  // Formatting values
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Determine risk level badges
  let riskBadgeColor = 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400';
  if (riskLevel === 'High') riskBadgeColor = 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400';
  if (riskLevel === 'Medium') riskBadgeColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';

  return (
    <div className="space-y-8 animate-fade-in print:space-y-4">
      
      {/* Action Header Panel */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 no-print border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div>
          <Link to={`/clients/${doc.client?._id}`} className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors">
            &larr; Back to {doc.client?.fullName || 'Client Profile'}
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 flex items-center gap-2 tracking-tight">
            <Sparkles className="h-7 w-7 text-primary-500 animate-pulse" />
            <span>AI Tax Audit Report</span>
          </h1>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm transition hover:scale-105 active:scale-950 duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Audit</span>
          </button>
          <Link
            to={`/reports/${review._id}`}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-600 hover:to-indigo-600 shadow-md shadow-primary-500/25 transition hover:scale-[1.01] active:scale-950 duration-200"
          >
            <FileText className="h-4 w-4" />
            <span>View Shareable Report</span>
          </Link>
        </div>
      </div>

      {/* Audit Banner Cover */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-sm print-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{doc.client?.fullName}</h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Taxpayer PAN: <span className="font-bold text-slate-700 dark:text-slate-200 font-mono tracking-wide">{doc.client?.panNumber}</span> &bull; 
              Document: <span className="font-bold text-slate-700 dark:text-slate-200">{doc.documentType}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              Audited by: {review.aiModelUsed} &bull; Generated: {new Date(review.reviewDate).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end space-y-2">
            <span className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${riskBadgeColor}`}>
              <ShieldAlert className="h-4 w-4 mr-1.5" />
              Risk Level: {riskLevel}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Processing latency: {review.processingTime}ms</span>
          </div>
        </div>

        {/* Quick summary grid of extracted numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-150 dark:border-slate-800">
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/45 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Gross Income</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {formatCurrency(incomeSummary.totalGrossIncome || incomeSummary.grossSalary + incomeSummary.otherIncome)}
            </span>
          </div>
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/45 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Claimed Deductions</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {formatCurrency(incomeSummary.deductionsTotal)}
            </span>
          </div>
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/45 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Net Taxable Income</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {formatCurrency(incomeSummary.taxableIncome)}
            </span>
          </div>
          <div className="p-4 bg-primary-500/5 dark:bg-primary-500/10 rounded-2xl border border-primary-500/10">
            <span className="text-[9px] font-bold text-primary-500 dark:text-primary-400 uppercase tracking-widest block">Taxes Deposited</span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1 block">
              {formatCurrency(taxesPaid.totalTaxPaid || taxesPaid.tds)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu Section */}
      <div className="border-b border-slate-200 dark:border-slate-800 no-print">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('findings')}
            className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors duration-150 ${
              activeTab === 'findings'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-305'
            }`}
          >
            AI Audit Findings ({issues.length})
          </button>
          <button
            onClick={() => setActiveTab('saving')}
            className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors duration-150 ${
              activeTab === 'saving'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-305'
            }`}
          >
            Optimization & Suggestions
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors duration-150 ${
              activeTab === 'raw'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-305'
            }`}
          >
            Extracted Summary Data
          </button>
        </nav>
      </div>

      {/* Content views based on active state */}
      <div className="space-y-6">
        
        {/* Tab 1: Findings / Issues */}
        {(activeTab === 'findings' || window.matchMedia('print').matches) && (
          <div className={`space-y-6 ${activeTab !== 'findings' ? 'print:block hidden' : 'block'}`}>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <span>Extracted Audits & Warnings</span>
              </h3>

              {issues.length === 0 ? (
                <div className="p-4.5 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 rounded-2xl flex items-start space-x-3.5">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">No critical compliance warnings</h4>
                    <p className="text-xs font-medium mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">AI verified values. PAN matches client registers, tax ratios conform, and withholding sums appear stable.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue, idx) => {
                    let severityColor = 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400';
                    if (issue.severity === 'High') severityColor = 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400';
                    if (issue.severity === 'Medium') severityColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';

                    return (
                      <div 
                        key={idx}
                        className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${severityColor}`}>
                            {issue.severity} Severity
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Finding #{idx + 1}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{issue.issue}</h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{issue.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Saving & Optimizations */}
        {(activeTab === 'saving' || window.matchMedia('print').matches) && (
          <div className={`space-y-6 ${activeTab !== 'saving' ? 'print:block hidden' : 'block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Missing deductions */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center">
                  <TrendingDown className="h-5 w-5 text-primary-500 mr-2" />
                  <span>Deduction Optimization Plan</span>
                </h3>
                
                {missingDeductions.length === 0 ? (
                  <p className="text-xs text-slate-500 font-medium">All eligible standard deductions and declarations claimed.</p>
                ) : (
                  <ul className="space-y-3.5">
                    {missingDeductions.map((d, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600 text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Missing document checklists */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center">
                  <FileText className="h-5 w-5 text-primary-500 mr-2" />
                  <span>Audit Evidence Checklist</span>
                </h3>

                {missingDocuments.length === 0 ? (
                  <p className="text-xs text-slate-500 font-medium">No additional supporting document files or statements checklist needed.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {missingDocuments.map((docName, idx) => (
                      <li key={idx} className="flex items-center space-x-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                        <BadgeHelp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span>{docName}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>

            {/* Recommendations block */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">Actionable Next Steps</h3>
              <ul className="space-y-3.5">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Detailed numbers */}
        {(activeTab === 'raw' || window.matchMedia('print').matches) && (
          <div className={`space-y-6 ${activeTab !== 'raw' ? 'print:block hidden' : 'block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Income summary table */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Extracted Income</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">Gross Salary</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(incomeSummary.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">Other Incomes (Interest, Rent)</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(incomeSummary.otherIncome)}</span>
                  </div>
                  <div className="flex justify-between py-3.5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                    <span>Total Income</span>
                    <span>{formatCurrency(incomeSummary.totalGrossIncome || incomeSummary.grossSalary + incomeSummary.otherIncome)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-red-600">
                    <span className="text-slate-500">Investment Deductions Claimed</span>
                    <span>-{formatCurrency(incomeSummary.deductionsTotal)}</span>
                  </div>
                  <div className="flex justify-between py-3.5 font-bold text-primary-600 dark:text-primary-400 bg-primary-500/5 dark:bg-primary-950/40 px-3.5 rounded-xl mt-2 border border-primary-500/10 text-sm">
                    <span>Net Taxable Income</span>
                    <span>{formatCurrency(incomeSummary.taxableIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Tax deposit summary */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Deposited Taxes Summary</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">TDS (Tax Deducted at Source)</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.tds)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">TCS (Tax Collected at Source)</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.tcs)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">Advance Taxes Paid</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.advanceTax)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-slate-500">Self Assessment Tax Paid</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.selfAssessmentTax)}</span>
                  </div>
                  <div className="flex justify-between py-3.5 font-bold text-success-600 dark:text-success-400 bg-success-500/5 dark:bg-success-950/40 px-3.5 rounded-xl mt-2 border border-success-500/10 text-sm">
                    <span>Total Taxes Paid</span>
                    <span>{formatCurrency(taxesPaid.totalTaxPaid || taxesPaid.tds)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Deductions breakdown table */}
            {deductions.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-900 dark:bg-slate-900/60 backdrop-blur-sm print-card">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Investment Claims Itemized List</h3>
                <div className="overflow-x-auto text-xs">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                    <thead>
                      <tr className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Claim / Section</th>
                        <th className="py-2.5 text-right">Amount Claimed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {deductions.map((d, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{d.name}</td>
                          <td className="py-3 font-bold text-right font-mono text-slate-900 dark:text-slate-100">{formatCurrency(d.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple inline loader for Status Generation
const Loader2 = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default DocumentDetail;
