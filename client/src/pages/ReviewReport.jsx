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
  Download, 
  ShieldAlert,
  Calendar,
  Lock,
  ChevronLeft,
  Briefcase
} from 'lucide-react';

const ReviewReport = () => {
  const { reviewId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const fetchReport = async () => {
    try {
      const response = await api.reports.get(reviewId);
      setReport(response.data.data);
    } catch (err) {
      console.error('Failed to load report:', err);
      toast.error('Failed to retrieve tax audit report details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reviewId]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const toastId = toast.loading('Generating professional PDF report...');
    try {
      const response = await api.reports.downloadPDF(reviewId);

      const blob = new Blob([response.data], {
        type: "application/pdf"
      });

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");

      const clientName = report.client?.fullName || 'Audit';
      const filename = `TaxReview_Report_${clientName.replace(/\s+/g, '_')}.pdf`;

      link.href = downloadUrl;
      link.download = filename || "TaxReviewReport.pdf";

      window.document.body.appendChild(link);

      link.click();

      window.document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('PDF report downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Failed to generate PDF download.', { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-12 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="h-96 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">Report Not Found</h3>
        <p className="mt-1 text-sm text-slate-500">The report link is invalid or you do not have permissions.</p>
        <Link to="/clients" className="mt-6 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-500">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { client, document: reviewDocument, incomeSummary, taxesPaid, deductions, missingDeductions, missingDocuments, issues, recommendations, riskLevel } = report;

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Determine risk levels
  let riskBadgeColor = 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/20 dark:text-success-400';
  if (riskLevel === 'High') riskBadgeColor = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400';
  if (riskLevel === 'Medium') riskBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400';

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto print:space-y-4 print:py-0">
      
      {/* Navigation & Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 no-print border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div>
          <Link to={`/clients/${client?._id}`} className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
            <ChevronLeft className="h-4 w-4 mr-0.5" />
            <span>Back to client dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-2 tracking-tight">
            <Briefcase className="h-7 w-7 text-primary-500" />
            <span>AI Tax Dossier Report</span>
          </h1>
        </div>

        {/* Buttons triggers */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm transition hover:scale-105 active:scale-950 duration-200"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-600 hover:to-indigo-600 shadow-md shadow-primary-500/25 transition hover:scale-[1.01] active:scale-950 duration-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Print Wrapper */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden print-card">
        
        {/* Cover Band */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-10 text-white flex justify-between items-start print:py-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="rounded-xl bg-white/20 p-2 backdrop-blur">
                <FileText className="h-6 w-6 text-white" />
              </span>
              <span className="text-xl font-bold tracking-wider uppercase font-mono">TaxReview AI</span>
            </div>
            <p className="text-[11px] text-white/90 font-medium">Intelligent Tax Audit & Optimization Report</p>
          </div>
          
          <div className="text-right">
            <span className="text-[9px] font-bold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full uppercase tracking-wider">
              Status: Reviewed
            </span>
            <p className="text-[10px] text-white/80 mt-2.5 font-medium">Date: {new Date(report.reviewDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="p-8 space-y-8 print:p-6 print:space-y-6">
          
          {/* Section 1: Client Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60 print:break-inside-avoid">
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Profile</h3>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-150">{client?.fullName}</h4>
                <p className="text-xs text-slate-500 flex items-center font-medium">PAN: <span className="font-bold text-slate-700 dark:text-slate-300 font-mono ml-1 uppercase tracking-wide">{client?.panNumber}</span></p>
                <p className="text-xs text-slate-500 font-medium">Email: {client?.email}</p>
                <p className="text-xs text-slate-500 font-medium">Contact: {client?.mobileNumber}</p>
              </div>
            </div>

            <div className="space-y-3 md:text-right">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:block hidden">Audit Metadata</h3>
              <div className="space-y-1 text-left md:text-right">
                <p className="text-xs text-slate-500 font-medium">Uploaded Document: <span className="font-semibold text-slate-700 dark:text-slate-300">{reviewDocument?.originalFileName}</span></p>
                <p className="text-xs text-slate-500 font-medium">Classification: <span className="font-semibold text-slate-700 dark:text-slate-300">{reviewDocument?.documentType}</span></p>
                <div className="pt-2">
                  <span className={`inline-flex items-center rounded-xl border px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${riskBadgeColor}`}>
                    <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                    Risk Assessment: {riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Numbers aggregation table */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Income & Taxes Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income summary table */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 print:break-inside-avoid">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary-500" />
                  <span>Annual Income Details</span>
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Gross Salary</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(incomeSummary.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Other Incomes (Interest, Rent)</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(incomeSummary.otherIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2.5 font-bold text-slate-800 dark:text-slate-150">
                    <span>Total Income</span>
                    <span>{formatCurrency(incomeSummary.totalGrossIncome || incomeSummary.grossSalary + incomeSummary.otherIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-red-600">
                    <span className="text-slate-500">Claimed Deductions (Sec 80)</span>
                    <span>-{formatCurrency(incomeSummary.deductionsTotal)}</span>
                  </div>
                  <div className="flex justify-between py-3 font-bold text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 px-3.5 rounded-xl mt-2 border border-primary-100 dark:border-primary-950/20 text-sm">
                    <span>Net Taxable Income</span>
                    <span>{formatCurrency(incomeSummary.taxableIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Tax deposit table */}
              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 print:break-inside-avoid">
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary-500" />
                  <span>Deposited Taxes</span>
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-semibold">
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">TDS (Source Withholding)</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.tds)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">TCS (Collection Credit)</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.tcs)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Advance Taxes Paid</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.advanceTax)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-500">Self Assessment Tax</span>
                    <span className="text-slate-800 dark:text-slate-100">{formatCurrency(taxesPaid.selfAssessmentTax)}</span>
                  </div>
                  <div className="flex justify-between py-3 font-bold text-success-600 dark:text-success-400 bg-white dark:bg-slate-900 px-3.5 rounded-xl mt-2 border border-success-100 dark:border-success-950/20 text-sm">
                    <span>Total Taxes Paid</span>
                    <span>{formatCurrency(taxesPaid.totalTaxPaid || taxesPaid.tds)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Findings Warnings list */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Audit Warnings & Anomalies</h3>
            
            {issues.length === 0 ? (
              <div className="p-4.5 bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20 rounded-2xl flex items-center space-x-2 text-xs font-semibold">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>No compliance risks, mismatch anomalies, or tax discrepancies were flagged.</span>
              </div>
            ) : (
              <div className="space-y-3.5">
                {issues.map((iss, idx) => {
                  let alertColor = 'border-slate-200 bg-slate-50 text-slate-700 dark:bg-slate-950/20';
                  if (iss.severity === 'High') alertColor = 'border-red-500/20 bg-red-500/10 text-red-600';
                  if (iss.severity === 'Medium') alertColor = 'border-amber-500/20 bg-amber-500/10 text-amber-600';

                  return (
                    <div key={idx} className={`p-5 rounded-2xl border flex items-start space-x-3.5 text-xs ${alertColor} print:break-inside-avoid`}>
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase tracking-wider block text-[9px] mb-1.5">{iss.severity} Severity Warning</span>
                        <h5 className="font-bold mb-1 text-slate-800 dark:text-slate-200 text-sm">{iss.issue}</h5>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-1">{iss.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Optimizations checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            
            {/* Missing Claim checks */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deductions Suggestions</h3>
              
              {missingDeductions.length === 0 ? (
                <p className="text-xs text-slate-500 font-semibold">All eligible standard deductions and declarations claimed.</p>
              ) : (
                <ul className="space-y-3">
                  {missingDeductions.map((d, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-400 leading-relaxed">
                      <TrendingDown className="h-4.5 w-4.5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Document checklists */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Evidence Checklist</h3>
              
              {missingDocuments.length === 0 ? (
                <p className="text-xs text-slate-500 font-semibold">No additional supporting document files or checklists needed.</p>
              ) : (
                <ul className="space-y-2.5">
                  {missingDocuments.map((docName, idx) => (
                    <li key={idx} className="flex items-center space-x-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 print:break-inside-avoid">
                      <CheckCircle2 className="h-4 w-4 text-slate-400" />
                      <span>{docName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Section 5: Actionable recommendations */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 print:break-inside-avoid">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actionable Next Steps</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer info notices */}
        <div className="bg-slate-50/50 px-8 py-6 text-center border-t border-slate-100 dark:bg-slate-950/20 dark:border-slate-800 print:break-inside-avoid">
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Confidential compliance review generated by TaxReview AI. This document outlines predictive rules outcomes and automated checks. Suitable for compliance audits and filing reviews.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewReport;
