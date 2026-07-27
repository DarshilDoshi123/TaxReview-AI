import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link, Navigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  UploadCloud, 
  FileText, 
  Users, 
  File, 
  X, 
  Loader2, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';

const DocumentUpload = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const queryClientId = searchParams.get('clientId') || '';

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(queryClientId);
  const [docType, setDocType] = useState('Form 16');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.clients.list();
        setClients(response.data.data);
        if (!selectedClientId && response.data.data.length > 0) {
          setSelectedClientId(response.data.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        toast.error('Failed to load client accounts');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Type validation
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF documents are supported!');
      return;
    }

    // Size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Document size must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedClientId) {
      toast.error('Please choose a client first.');
      return;
    }
    if (!selectedFile) {
      toast.error('Please drag or select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('clientId', selectedClientId);
    formData.append('documentType', docType);

    setUploading(true);
    setUploadProgress(10); // set mock starts

    try {
      await api.documents.upload(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // Avoid marking 100 until server completes background processing triggers
        setUploadProgress(Math.min(percent, 95));
      });

      setUploadProgress(100);
      toast.success('Document uploaded successfully! AI audit initiated.');
      
      // Redirect back to the client detail page to monitor progress
      setTimeout(() => {
        navigate(`/clients/${selectedClientId}`);
      }, 1000);

    } catch (error) {
      console.error('File upload failed:', error);
      const msg = error.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(msg);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-96 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  const activeClientName = clients.find(c => c._id === selectedClientId)?.fullName || 'Selected Client';

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Upload Tax Document</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Upload a tax statement in PDF format. The AI auditor will extract text and process compliance checkpoints.</p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white/60 p-8 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-sm">
        <form onSubmit={handleUpload} className="space-y-6">
          
          {/* Select client profiles */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
              <Users className="h-4 w-4 mr-1.5 text-primary-500" />
              <span>Select Taxpayer Client</span>
            </label>
            {user?.role === 'Client' ? (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/80 text-sm font-semibold dark:text-slate-200">
                {clients[0] ? `${clients[0].fullName} (${clients[0].panNumber})` : 'Resolving taxpayer profile...'}
              </div>
            ) : queryClientId ? (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/80 text-sm font-semibold dark:text-slate-200">
                {activeClientName}
              </div>
            ) : clients.length === 0 ? (
              <div className="p-4 bg-amber-500/10 rounded-xl text-xs text-amber-600 border border-amber-500/25 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2.5 flex-shrink-0" />
                <span>No clients registered. <Link to="/clients" className="underline font-bold">Add a client profile</Link> before uploading files.</span>
              </div>
            ) : (
              <div className="relative rounded-xl shadow-sm">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all cursor-pointer appearance-none"
                >
                  {clients.map(c => (
                    <option key={c._id} value={c._id} className="bg-slate-950 text-white text-sm">{c.fullName} ({c.panNumber})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Select document type classification */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-1.5 text-primary-500" />
              <span>Document Type</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all cursor-pointer appearance-none"
              >
                <option value="Form 16" className="bg-slate-950 text-white text-sm">Form 16 (TDS Certificate - Salaried)</option>
                <option value="AIS" className="bg-slate-950 text-white text-sm">Annual Information Statement (AIS)</option>
                <option value="Form 26AS" className="bg-slate-950 text-white text-sm">Form 26AS (Tax Credit Statement)</option>
                <option value="Salary Slip" className="bg-slate-950 text-white text-sm">Monthly Salary Pay Slip</option>
                <option value="Income Tax Notice" className="bg-slate-950 text-white text-sm">Income Tax Notice / Demand Notice</option>
                <option value="Other PDF Documents" className="bg-slate-950 text-white text-sm">Other Generic Tax PDF</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* File Drag and Drop target */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Tax Document PDF File
            </label>
            
            {!selectedFile ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? 'border-primary-500 bg-primary-500/[0.04] scale-[0.99] shadow-inner shadow-primary-500/5'
                    : 'border-slate-300 hover:border-primary-500 dark:border-slate-800 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-950/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="rounded-2xl bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 p-4 text-primary-600 mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drag and drop your PDF document here
                </p>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  or click to browse local files (Limit: 10MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center space-x-3.5">
                  <div className="rounded-xl bg-red-500/10 p-2.5 text-red-700 border border-red-500/10">
                    <File className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">{selectedFile.name}</h4>
                    <p className="text-xs font-semibold text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB &bull; PDF</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={uploading}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* Progress Indicators */}
          {uploading && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary-500" />Uploading tax document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit uploads */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              disabled={uploading || !selectedFile || !selectedClientId}
              className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-500/20 disabled:opacity-50 transition hover:scale-[1.01] active:scale-98 duration-200"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  <span>Uploading PDF & Ingesting...</span>
                </>
              ) : (
                <>
                  <span>Upload & Analyze</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
