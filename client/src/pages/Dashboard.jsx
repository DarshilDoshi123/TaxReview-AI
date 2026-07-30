import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus, 
  UploadCloud, 
  ArrowRight, 
  TrendingUp,
  FileCheck,
  RefreshCw,
  FolderLock,
  Search,
  Sparkles,
  Info,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalDocuments: 0,
    pendingReviews: 0,
    processingReviews: 0,
    completedReviews: 0,
    failedReviews: 0,
    totalReports: 0,
  });
  const [activities, setActivities] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useAuth();
  const [myClient, setMyClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchDashboardData = async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    try {
      const [statsRes, activityRes, chartRes, uploadsRes, reviewsRes] = await Promise.all([
        api.dashboard.stats(),
        api.dashboard.activity(),
        api.dashboard.monthlyStats(),
        api.dashboard.recentUploads(),
        api.dashboard.recentReviews(),
      ]);
      setStats(statsRes.data.data);
      setActivities(activityRes.data.data);
      setChartData(chartRes.data.data);
      setRecentUploads(uploadsRes.data.data);
      setRecentReviews(reviewsRes.data.data);

      if (user?.role === 'Client') {
        try {
          const clientsRes = await api.clients.list();
          const clientList = Array.isArray(clientsRes.data?.data) ? clientsRes.data.data : [];
          if (clientList.length > 0) {
            setMyClient(clientList[0]);
          }
        } catch (cErr) {
          console.error('Failed to load client profile:', cErr);
        }
      }
      
      if (isManual) {
        toast.success('Dashboard updated successfully');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      if (isManual) {
        toast.error('Failed to refresh dashboard data.');
      } else {
        toast.error('Failed to load dashboard analytics.');
      }
    } finally {
      setLoading(false);
      if (isManual) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Poll for document processing updates in real-time
  useEffect(() => {
    const hasRunningDocs = recentUploads.some(
      (doc) => doc.reviewStatus === 'Processing' || doc.reviewStatus === 'Pending'
    );

    if (!hasRunningDocs) return;

    const interval = setInterval(async () => {
      try {
        const [uploadsRes, statsRes, reviewsRes] = await Promise.all([
          api.dashboard.recentUploads(),
          api.dashboard.stats(),
          api.dashboard.recentReviews()
        ]);
        setRecentUploads(uploadsRes.data.data);
        setStats(statsRes.data.data);
        setRecentReviews(reviewsRes.data.data);
      } catch (err) {
        console.error('Error polling dashboard status:', err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [recentUploads]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* KPI Skeleton Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
        {/* Chart Skeleton */}
        <div className="h-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  // Filter recent uploads table based on search
  const filteredUploads = recentUploads.filter((doc) => {
    const matchesSearch = 
      doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.client?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doc.reviewStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const cards = [
    { name: 'Total Clients', value: stats.totalClients, icon: Users, color: 'from-indigo-500/20 to-purple-500/10 text-indigo-600 dark:text-indigo-400', desc: 'Active client profiles', link: '/clients', trend: '+4% this week', trendColor: 'text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full' },
    { name: 'Documents Uploaded', value: stats.totalDocuments, icon: FileText, color: 'from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400', desc: 'Total tax statements', link: '/clients', trend: '+12% this month', trendColor: 'text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full' },
    { name: 'AI Audit Reports', value: stats.totalReports, icon: FileCheck, color: 'from-green-500/20 to-emerald-500/10 text-green-600 dark:text-green-400', desc: 'Completed review files', link: '/clients', trend: '98.5% accuracy', trendColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full' },
    { name: 'Failed Audits', value: stats.failedReviews, icon: AlertTriangle, color: 'from-red-500/20 to-orange-500/10 text-red-600 dark:text-red-400', desc: 'Review run failures', link: '/clients', trend: '0% queue block', trendColor: 'text-slate-500 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded-full' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">System Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Real-time audit status, monthly ingestion trends, and compliance tracking.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:scale-105 active:scale-950 duration-200 disabled:opacity-50 disabled:pointer-events-none"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI statistics cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.name} 
              to={card.link}
              className="block rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-indigo-500/20 group relative overflow-hidden"
            >
              {/* Card ambient background subtle gradient glow */}
              <div className={`absolute top-0 right-0 h-24 w-24 rounded-full bg-gradient-to-br ${card.color.split(' ')[0]} ${card.color.split(' ')[1]} blur-2xl opacity-40 pointer-events-none group-hover:scale-125 transition-transform duration-500`} />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.name}</p>
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{card.value}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${card.trendColor}`}>
                      {card.trend}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      {card.desc}
                    </span>
                  </div>
                </div>
                
                <div className={`rounded-xl p-3 bg-gradient-to-br ${card.color.split(' ')[0]} ${card.color.split(' ')[1]} ${card.color.split(' ')[2]} dark:${card.color.split(' ')[3]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Detailed Status Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm text-center">
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Queue</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">{stats.pendingReviews}</span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-1 border-l border-slate-200/60 dark:border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Queue</span>
          <span className="text-xl font-extrabold text-amber-500 tracking-tight flex justify-center items-center gap-1.5">
            {stats.processingReviews > 0 && <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />}
            {stats.processingReviews}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-1 border-l border-slate-200/60 dark:border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed Audits</span>
          <span className="text-xl font-extrabold text-success-500 tracking-tight">{stats.completedReviews}</span>
        </div>
        <div className="flex flex-col items-center justify-center space-y-1 border-l border-slate-200/60 dark:border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Failed Audits</span>
          <span className="text-xl font-extrabold text-red-500 tracking-tight">{stats.failedReviews}</span>
        </div>
      </div>

      {/* Quick Action triggers */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-6 dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
        {user?.role === 'Client' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to={myClient ? `/clients/${myClient._id}` : '#'}
              onClick={(e) => {
                if (!myClient) {
                  e.preventDefault();
                  toast.error('Tax profile not generated yet. No uploaded documents.');
                }
              }}
              className={`flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-all duration-300 group ${!myClient ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="rounded-xl p-3 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-800 dark:text-slate-300">View My Tax Profile</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Access uploaded statements and review logs</span>
              </div>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-all duration-300 group"
            >
              <div className="rounded-xl p-3 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-800 dark:text-slate-300">Security Settings</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Manage details and login credentials</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/clients"
              className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-all duration-300 group"
            >
              <div className="rounded-xl p-3 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-800 dark:text-slate-200">Add Client</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Create taxpayer profile</span>
              </div>
            </Link>
            <Link
              to="/upload"
              className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-all duration-300 group"
            >
              <div className="rounded-xl p-3 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-800 dark:text-slate-200">Upload PDF</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5">Form 16, AIS, statement slips</span>
              </div>
            </Link>
            <Link
              to="/clients"
              className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-all duration-300 group"
            >
              <div className="rounded-xl p-3 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-800 dark:text-slate-200">View Reports</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5">Audit reports directory</span>
              </div>
            </Link>
            <Link
              to="/reviews/pending"
              className="flex items-center space-x-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:bg-primary-500/[0.02] dark:hover:bg-primary-500/[0.04] transition-all duration-300 group"
            >
              <div className="rounded-xl p-3 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-bold block text-slate-800 dark:text-slate-200">Pending Reviews</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block mt-0.5">Track items in progress</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Analytics Graph */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2.5">
            <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Uploads vs Completed Reviews</h3>
          </div>
          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/40 px-3 py-1 rounded-full uppercase tracking-wider">Last 6 Months</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(9, 9, 14, 0.95)', 
                  border: '1px solid rgba(255, 255, 255, 0.05)', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Area type="monotone" name="Uploads" dataKey="uploads" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUploads)" />
              <Area type="monotone" name="Completed Audits" dataKey="reviews" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReviews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table 1: Recent Uploads (Search + Filter check) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary-500" />
              <span>Recent Uploaded Statements</span>
            </h3>
            
            {/* Table search filters */}
            <div className="flex items-center space-x-2.5">
              <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-1 flex items-center transition-all focus-within:border-primary-500">
                <Search className="h-3.5 w-3.5 text-slate-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-28 sm:w-36 rounded-md border-0 bg-transparent py-1 pl-1.5 pr-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-0 placeholder-slate-400"
                  placeholder="Filter name..."
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer appearance-none pr-8 relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.25em 1.25em',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">All Statuses</option>
                <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Completed</option>
                <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Pending</option>
                <option value="Processing" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Processing</option>
                <option value="Failed" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Failed</option>
              </select>
            </div>
          </div>

          {filteredUploads.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No recent uploads match active filters.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left">
                <thead>
                  <tr className="text-slate-400 font-bold">
                    <th className="py-3 px-2">Document Details</th>
                    <th className="py-3 px-2">Taxpayer Client</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredUploads.slice(0, 5).map((docItem) => (
                    <tr key={docItem._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[140px] sm:max-w-[200px]" title={docItem.originalFileName}>
                          {docItem.originalFileName}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">{docItem.documentType} &bull; {(docItem.fileSize / 1024).toFixed(1)} KB</span>
                      </td>
                      <td className="py-3.5 px-2">
                        {docItem.client ? (
                          <Link to={`/clients/${docItem.client._id}`} className="hover:underline font-semibold text-primary-600 dark:text-primary-400">
                            {docItem.client.fullName}
                          </Link>
                        ) : 'Unknown'}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                          docItem.reviewStatus === 'Completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                          docItem.reviewStatus === 'Failed' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {docItem.reviewStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        {docItem.reviewStatus === 'Completed' ? (
                          <Link to={`/documents/${docItem._id}`} className="text-primary-600 font-bold hover:underline">
                            View Audit
                          </Link>
                        ) : '---'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table 2: Recent AI Completed Review Reports */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Sparkles className="h-4.5 w-4.5 text-primary-500 animate-pulse" />
            <span>Recent AI Completed Audits</span>
          </h3>

          {recentReviews.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No completed audit reports generated yet.
            </div>
          ) : (
            <div className="space-y-4">
              {recentReviews.slice(0, 5).map((rev) => {
                let riskColor = 'bg-green-500/10 text-green-600 border-green-500/20';
                if (rev.riskLevel === 'High') riskColor = 'bg-red-500/10 text-red-600 border-red-500/20';
                if (rev.riskLevel === 'Medium') riskColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20';

                return (
                  <div key={rev._id} className="p-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/60 flex justify-between items-center text-xs hover:border-slate-300 dark:hover:border-slate-800 transition-colors">
                     <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{rev.client?.fullName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{rev.document?.documentType || 'Tax Doc'} &bull; latency {rev.processingTime}ms</p>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${riskColor}`}>
                        {rev.riskLevel} Risk
                      </span>
                      <Link to={`/reports/${rev._id}`} className="block text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline">
                        Open Report &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
