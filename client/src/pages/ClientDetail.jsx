import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Trash2, 
  Eye, 
  Plus, 
  FileText,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Edit3,
  X,
  Download
} from 'lucide-react';
import { useForm } from 'react-hook-form';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Populate edit form defaults when client data loads
  useEffect(() => {
    if (client) {
      let dobString = '';
      if (client.dateOfBirth) {
        dobString = new Date(client.dateOfBirth).toISOString().split('T')[0];
      }
      reset({
        fullName: client.fullName,
        panNumber: client.panNumber,
        email: client.email,
        mobileNumber: client.mobileNumber,
        address: client.address || '',
        dateOfBirth: dobString,
        notes: client.notes || '',
      });
    }
  }, [client, reset]);

  const onEditSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating client profile...');
    try {
      const response = await api.clients.update(id, data);
      setClient(response.data.data);
      toast.success('Client profile updated successfully!', { id: toastId });
      setEditModalOpen(false);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update client profile';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchClientDetails = async () => {
    try {
      const [clientRes, docsRes] = await Promise.all([
        api.clients.get(id),
        api.documents.list(id)
      ]);
      setClient(clientRes.data.data);
      setDocuments(docsRes.data.data);
    } catch (err) {
      console.error('Error fetching client details:', err);
      toast.error('Failed to retrieve client profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  // Poll for document processing updates
  useEffect(() => {
    const hasRunningDocs = documents.some(
      (doc) => doc.reviewStatus === 'Processing' || doc.reviewStatus === 'Pending'
    );

    if (!hasRunningDocs) return;

    const interval = setInterval(async () => {
      try {
        const docsRes = await api.documents.list(id);
        setDocuments(docsRes.data.data);
      } catch (err) {
        console.error('Error polling documents status:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [documents, id]);

  const handleDeleteDoc = async (docId, fileName) => {
    if (window.confirm(`Are you sure you want to delete document "${fileName}"?\nAll associated text extractions and AI tax reviews will be permanently deleted.`)) {
      const toastId = toast.loading('Deleting document record...');
      try {
        await api.documents.delete(docId);
        toast.success('Document deleted successfully', { id: toastId });
        fetchClientDetails(); // Reload page datasets
      } catch (err) {
        toast.error('Failed to delete document', { id: toastId });
      }
    }
  };

  const handleDownloadDoc = async (docId, fileName) => {
    const toastId = toast.loading('Preparing file download...');
    try {
      const response = await api.documents.download(docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Download started successfully!', { id: toastId });
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download document file', { id: toastId });
    }
  };

  const handleTriggerAnalysis = async (docId) => {
    const toastId = toast.loading('Initiating AI tax audit...');
    try {
      await api.reviews.analyze(docId);
      toast.success('AI Audit analysis completed successfully!', { id: toastId });
      fetchClientDetails(); // Reload docs to update states
    } catch (err) {
      const msg = err.response?.data?.message || 'AI review run encountered a failure';
      toast.error(msg, { id: toastId });
      fetchClientDetails();
    }
  };

  const formatUploadDateTime = (timestamp) => {
    if (!timestamp) return 'Upload time unavailable';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Upload time unavailable';
    try {
      // Format: DD/MM/YYYY, HH:MM AM/PM or similar localized style
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
      <div className="space-y-6 animate-pulse">
        <div className="h-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="h-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <User className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">Client Profile Not Found</h3>
        <p className="mt-1 text-sm text-slate-500">The profile might have been deleted or you don't have access.</p>
        <Link to="/clients" className="mt-4 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-500">
          Back to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <div>
        <Link to="/clients" className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors flex items-center gap-1.5">
          &larr; Back to Clients Directory
        </Link>
      </div>

      {/* Client profile metadata card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative animate-scale-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar and Info (Col span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-5">
                {/* Client Avatar initials */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-xl font-extrabold text-white shadow-lg shadow-primary-500/20">
                  {client.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{client.fullName}</h1>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="bg-primary-500/10 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400 border border-primary-500/20 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono tracking-wider uppercase">
                      PAN: {client.panNumber}
                    </span>
                    {client.dateOfBirth && (
                      <span className="flex items-center text-xs font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                        DoB: {new Date(client.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3 self-start sm:self-auto">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm transition hover:scale-105 active:scale-950 duration-200"
                >
                  <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Edit Profile</span>
                </button>
                <Link
                  to={`/upload?clientId=${client._id}`}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-600 hover:to-indigo-600 shadow-md shadow-primary-500/20 transition hover:scale-105 active:scale-950 duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload Document</span>
                </Link>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-800 dark:text-slate-300">{client.email}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-800 dark:text-slate-300">{client.mobileNumber}</span>
              </div>
              {client.address && (
                <div className="flex items-center space-x-2.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="truncate text-slate-800 dark:text-slate-300" title={client.address}>{client.address}</span>
                </div>
              )}
            </div>

            {client.notes && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl text-xs text-slate-500 border border-slate-200/60 dark:border-slate-800/60">
                <strong className="text-slate-700 dark:text-slate-300 font-bold">Profile Notes:</strong> {client.notes}
              </div>
            )}
          </div>

          {/* Quick Statistics (Col span 1) */}
          <div className="border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Overview</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Portfolio</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{documents.length} Files</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Audited</span>
                <span className="text-sm font-extrabold text-green-600 dark:text-green-400">{documents.filter(d => d.reviewStatus === 'Completed').length} Docs</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">In Queue</span>
                <span className="text-sm font-extrabold text-amber-500">{documents.filter(d => d.reviewStatus === 'Pending' || d.reviewStatus === 'Processing').length} Docs</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Failed</span>
                <span className="text-sm font-extrabold text-red-500">{documents.filter(d => d.reviewStatus === 'Failed').length} Docs</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Uploaded tax documents section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-7 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <FolderOpen className="h-5 w-5 text-primary-500 mr-2" />
            <span>Tax Document Portfolio</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-xl">
            {documents.length} File(s)
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
            <h4 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">No documents uploaded yet</h4>
            <p className="mt-1 text-xs text-slate-500">Upload Form 16, AIS, or salary statements to run AI audits.</p>
            <Link
              to={`/upload?clientId=${client._id}`}
              className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-primary-500/10 px-3.5 py-2 text-xs font-bold text-primary-600 hover:bg-primary-500/20 dark:bg-primary-500/15 dark:text-primary-400 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload PDF Document</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => {
              // Build status badge
              let statusBadge = (
                <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                  Pending
                </span>
              );

              if (doc.reviewStatus === 'Processing') {
                statusBadge = (
                  <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/30 px-2.5 py-0.5 rounded-full animate-pulse">
                    <RefreshCw className="h-3 w-3 mr-1.5 animate-spin" />
                    AI Reviewing...
                  </span>
                );
              } else if (doc.reviewStatus === 'Completed') {
                statusBadge = (
                  <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-950/30 px-2.5 py-0.5 rounded-full">
                    Completed
                  </span>
                );
              } else if (doc.reviewStatus === 'Failed') {
                statusBadge = (
                  <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-950/30 px-2.5 py-0.5 rounded-full">
                    Failed
                  </span>
                );
              }

              return (
                <div 
                  key={doc._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition duration-150 gap-4"
                >
                  <div className="flex items-start space-x-4">
                    <div className="rounded-xl bg-red-500/10 p-2.5 text-red-500 border border-red-500/10">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{doc.originalFileName}</h4>
                      <p className="text-xs text-slate-500">
                        Type: <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.documentType}</span> &bull; 
                        Size: <span className="font-semibold text-slate-700 dark:text-slate-300">{(doc.fileSize / 1024).toFixed(1)} KB</span> &bull; 
                        Uploaded: {formatUploadDateTime(doc.uploadedAt || doc.uploadDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 self-end sm:self-auto">
                    {statusBadge}
                    
                    <div className="flex items-center space-x-2">
                      {doc.reviewStatus === 'Completed' ? (
                        <Link
                          to={`/documents/${doc._id}`}
                          className="flex items-center space-x-1.5 text-xs font-bold text-primary-600 hover:text-primary-500 bg-primary-500/10 dark:bg-primary-500/15 px-3.5 py-2 rounded-xl transition duration-150 active:scale-950 shadow-sm"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>View Review</span>
                        </Link>
                      ) : (
                        doc.reviewStatus === 'Failed' && (
                          <button
                            onClick={() => handleTriggerAnalysis(doc._id)}
                            className="flex items-center space-x-1.5 text-xs font-bold text-amber-600 hover:text-amber-500 bg-amber-500/10 dark:bg-amber-500/15 px-3.5 py-2 rounded-xl transition duration-150 active:scale-950"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Retry Review</span>
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handleDownloadDoc(doc._id, doc.originalFileName)}
                        className="text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-205 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl transition active:scale-950"
                        title="Download Document"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteDoc(doc._id, doc.originalFileName)}
                        className="text-red-600 hover:text-red-500 bg-red-500/10 dark:bg-red-500/15 p-2.5 rounded-xl transition active:scale-950"
                        title="Delete Document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Client Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-scale-up">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mb-6">
              <Edit3 className="h-5 w-5 text-primary-500 mr-2" />
              <span>Edit Client Profile</span>
            </h3>

            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input
                  type="text"
                  className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                  placeholder="e.g. Aditi Sharma"
                  {...register('fullName', { required: 'Full Name is required' })}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PAN Card Number</label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent font-mono"
                    placeholder="ABCDE1234F"
                    {...register('panNumber', {
                      required: 'PAN Card Number is required',
                      pattern: {
                        value: /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
                        message: 'Format must match ABCDE1234F',
                      },
                    })}
                  />
                  {errors.panNumber && <p className="mt-1 text-xs text-red-500">{errors.panNumber.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all cursor-pointer"
                    {...register('dateOfBirth')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                    placeholder="aditi@domain.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mobile Number</label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                    placeholder="+91 9876543210"
                    {...register('mobileNumber', { required: 'Mobile Number is required' })}
                  />
                  {errors.mobileNumber && <p className="mt-1 text-xs text-red-500">{errors.mobileNumber.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Address</label>
                <input
                  type="text"
                  className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                  placeholder="Street name, City, State"
                  {...register('address')}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Audit Notes / Comments</label>
                <textarea
                  className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                  rows="2"
                  placeholder="e.g. Salaried employee, claims high HRA..."
                  {...register('notes')}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-500/20 disabled:opacity-50 transition active:scale-98"
                >
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;
