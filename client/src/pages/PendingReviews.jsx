import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Clock, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  ArrowRight,
  Loader2,
  Layers
} from 'lucide-react';

const PendingReviews = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyzingIds, setAnalyzingIds] = useState(new Set());

  const fetchPendingDocuments = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const response = await api.documents.list();
      // Filter only "Pending" or "Processing" reviews
      const pendingDocs = response.data.data.filter(
        (doc) => doc.reviewStatus === 'Pending' || doc.reviewStatus === 'Processing'
      );
      setDocuments(pendingDocs);
      if (showToast) {
        toast.success('Pending reviews list refreshed!');
      }
    } catch (err) {
      console.error('Error fetching pending documents:', err);
      toast.error('Failed to retrieve pending reviews list.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  // Poll for queued pending reviews automatically
  useEffect(() => {
    if (documents.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const response = await api.documents.list();
        const pendingDocs = response.data.data.filter(
          (doc) => doc.reviewStatus === 'Pending' || doc.reviewStatus === 'Processing'
        );
        setDocuments(pendingDocs);
      } catch (err) {
        console.error('Error polling pending reviews:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [documents]);

  const handleStartReview = async (docId) => {
    setAnalyzingIds((prev) => {
      const next = new Set(prev);
      next.add(docId);
      return next;
    });
    const toastId = toast.loading('Initiating AI tax audit review...');
    try {
      await api.reviews.analyze(docId);
      toast.success('AI Review analysis completed successfully!', { id: toastId });
      fetchPendingDocuments();
    } catch (err) {
      const msg = err.response?.data?.message || 'AI review run encountered a failure';
      toast.error(msg, { id: toastId });
      fetchPendingDocuments();
    } finally {
      setAnalyzingIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
    }
  };

  const handleViewProgress = (docName) => {
    toast.info(`Review for "${docName}" is currently processing. Refresh status to check again.`);
  };

  const formatUploadDateTime = (timestamp) => {
    if (!timestamp) return 'Upload time unavailable';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Upload time unavailable';
    try {
      return date.toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Upload time unavailable';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-12 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Clock className="h-8 w-8 text-primary-500" />
            <span>Pending Reviews Directory</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Manage tax statements queued for audits. Trigger analysis or track active background worker threads.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchPendingDocuments(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm transition-all hover:scale-105 active:scale-950 duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-4">
          <Layers className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No pending reviews found.</h3>
          <p className="text-xs text-slate-500 px-6">
            All uploaded statements have been successfully audited by the compliance engine. No records currently remain in pending or processing queue.
          </p>
          <div className="pt-2">
            <Link 
              to="/upload" 
              className="inline-flex items-center space-x-2 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-600 transition-all shadow-md shadow-primary-500/25"
            >
              <span>Upload New Statement</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
              <thead>
                <tr className="text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-950/10">
                  <th className="py-4.5 px-6">Document Name</th>
                  <th className="py-4.5 px-6">Client Info</th>
                  <th className="py-4.5 px-6">Uploaded By</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {documents.map((doc) => {
                  const isAnalyzing = analyzingIds.has(doc._id);
                  const isProcessing = doc.reviewStatus === 'Processing';

                  return (
                    <tr 
                      key={doc._id} 
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Document Details */}
                      <td className="py-4 px-6">
                        <Link 
                          to={`/documents/${doc._id}`}
                          className="font-bold text-slate-800 dark:text-slate-100 hover:underline block truncate max-w-[200px]"
                          title={doc.originalFileName}
                        >
                          {doc.originalFileName}
                        </Link>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                          {doc.documentType} &bull; {(doc.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </td>

                      {/* Client details */}
                      <td className="py-4 px-6">
                        {doc.client ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              {doc.client.fullName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">
                              PAN: {doc.client.panNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Uploaded By */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                            {doc.uploadedBy?.name || 'System'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {formatUploadDateTime(doc.uploadedAt || doc.uploadDate)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                          isProcessing 
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse'
                            : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                        }`}>
                          {isProcessing && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                          {doc.reviewStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-2.5">
                          <Link
                            to={`/documents/${doc._id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                            title="View Document Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Link>

                          {isProcessing ? (
                            <button
                              onClick={() => handleViewProgress(doc.originalFileName)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:bg-amber-500/20 transition"
                              title="View Processing Progress"
                            >
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Progress</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartReview(doc._id)}
                              disabled={isAnalyzing}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-600 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-primary-600 transition shadow-sm"
                              title="Start AI Review"
                            >
                              {isAnalyzing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                              ) : (
                                <Sparkles className="h-3.5 w-3.5 mr-1" />
                              )}
                              <span>{isAnalyzing ? 'Starting...' : 'Start Audit'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingReviews;
