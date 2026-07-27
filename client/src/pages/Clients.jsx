import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  Trash2, 
  Eye, 
  Mail, 
  Phone,
  FileText, 
  Calendar,
  AlertCircle,
  Grid,
  List
} from 'lucide-react';

const Clients = () => {
  const { user } = useAuth();

  if (user?.role === 'Client') {
    return <Navigate to="/" replace />;
  }
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchClients = async () => {
    try {
      const response = await api.clients.list();
      setClients(response.data.data);
      setFilteredClients(response.data.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      toast.error('Failed to retrieve client profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter(
          (c) =>
            c.fullName.toLowerCase().includes(query) ||
            c.panNumber.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clients]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Adding client profile...');
    try {
      await api.clients.create(data);
      toast.success('Client profile added successfully!', { id: toastId });
      setModalOpen(false);
      reset();
      fetchClients();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create client';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete client "${name}"?\nThis will permanently wipe all client records, uploaded documents, and AI review reports.`)) {
      const toastId = toast.loading('Deleting client profiles...');
      try {
        await api.clients.delete(id);
        toast.success('Client profile deleted', { id: toastId });
        fetchClients();
      } catch (error) {
        toast.error('Failed to delete client', { id: toastId });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-12 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="h-96 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Clients Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Manage taxpayer portfolios, log PAN cards, and monitor compliance reports.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-500/20 transition-all hover:scale-105 active:scale-950 duration-200 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Input Filter & View Toggles */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between no-print">
        <div className="relative flex-1 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-2 flex items-center backdrop-blur-sm transition-all focus-within:border-primary-500">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl border-0 bg-transparent py-3.5 pl-11 pr-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 text-sm"
            placeholder="Search by client name, PAN details, or email address..."
          />
        </div>

        {/* Toggle layout mode */}
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 rounded-xl shadow-sm self-end sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2.5 rounded-lg transition ${viewMode === 'card' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            title="Card/Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Clients data list/cards */}
      <div>
        {filteredClients.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-lg mx-auto space-y-4 animate-scale-up">
            <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No clients found</h3>
            <p className="text-xs text-slate-500 font-medium">
              {searchQuery ? 'Adjust your search query.' : 'Add your first taxpayer client profile to get started.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-600 transition active:scale-950 shadow-md shadow-primary-500/20"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add First Client</span>
              </button>
            )}
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-up">
            {filteredClients.map((client) => {
              const initials = client.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              return (
                <div 
                  key={client._id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-indigo-500/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-sm font-bold text-white shadow-md shadow-primary-500/20">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{client.fullName}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-500 block font-medium mt-1">
                          Added: {new Date(client.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 mb-6 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">PAN Number</span>
                        <span className="font-bold font-mono uppercase bg-primary-500/10 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg border border-primary-500/10">
                          {client.panNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Email</span>
                        <span className="truncate max-w-[170px] text-slate-800 dark:text-slate-300 font-medium">{client.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Mobile</span>
                        <span className="text-slate-800 dark:text-slate-300 font-medium">{client.mobileNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                    <Link
                      to={`/clients/${client._id}`}
                      className="flex items-center space-x-1.5 text-xs font-bold text-primary-600 hover:text-primary-500 bg-primary-500/10 dark:bg-primary-500/15 px-3.5 py-2 rounded-xl transition duration-150 active:scale-950 shadow-sm"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Profile</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(client._id, client.fullName)}
                      className="text-red-600 hover:text-red-500 bg-red-500/10 dark:bg-red-500/15 p-2 rounded-xl transition duration-150 active:scale-950 border border-transparent hover:border-red-500/10"
                      title="Delete Client"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60 overflow-hidden backdrop-blur-sm animate-scale-up">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-950/45">
                  <tr>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Client Details</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 uppercase tracking-widest">PAN Number</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Number</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Added Date</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredClients.map((client) => (
                    <tr key={client._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{client.fullName}</span>
                          <span className="text-xs text-slate-400 flex items-center mt-1"><Mail className="h-3 w-3 mr-1" />{client.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap font-mono text-sm uppercase">
                        <span className="bg-primary-500/10 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20 px-2.5 py-1 rounded-lg font-bold text-xs tracking-wider">
                          {client.panNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 text-slate-400 mr-2" />
                          {client.mobileNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
                        {new Date(client.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-right text-xs font-bold">
                        <div className="flex items-center justify-end space-x-2.5">
                          <Link
                            to={`/clients/${client._id}`}
                            className="flex items-center space-x-1.5 text-primary-600 hover:text-primary-500 bg-primary-500/10 dark:bg-primary-500/15 px-3 py-2 rounded-xl transition duration-150 active:scale-950"
                            title="View Profile Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Profile</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(client._id, client.fullName)}
                            className="text-red-600 hover:text-red-500 bg-red-500/10 dark:bg-red-500/15 p-2 rounded-xl transition duration-150 active:scale-950"
                            title="Delete Client"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-scale-up">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mb-6">
              <Users className="h-5 w-5 text-primary-500 mr-2" />
              <span>Add Client Profile</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    min="1900-01-01"
                    max="2099-12-31"
                    onInput={(e) => {
                      if (e.target.value) {
                        const parts = e.target.value.split('-');
                        if (parts[0] && parts[0].length > 4) {
                          parts[0] = parts[0].slice(0, 4);
                          e.target.value = parts.join('-');
                        }
                      }
                    }}
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
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition active:scale-98"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-500/20 disabled:opacity-50 transition active:scale-98"
                >
                  {isSubmitting ? 'Saving Profile...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
