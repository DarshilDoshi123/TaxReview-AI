import axios from 'axios';

let baseUrl = import.meta.env.DEV 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'https://taxreview-ai-api.onrender.com/api');

// Normalize base URL: strip trailing slashes and ensure it ends with /api
baseUrl = baseUrl.replace(/\/+$/, '');
if (baseUrl && !baseUrl.endsWith('/api')) {
  baseUrl = baseUrl + '/api';
}

axios.defaults.baseURL = baseUrl;

// Request interceptor to dynamically inject the JWT Bearer token
axios.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('taxreview_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.token) {
          config.headers['Authorization'] = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Failed to parse cached user token in interceptor:', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauthorized errors automatically
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
    const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

    if (error.response && error.response.status === 401 && !isAuthEndpoint && !isAuthPage) {
      localStorage.removeItem('taxreview_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create API wrapper object
const api = {
  auth: {
    login: (email, password) => axios.post('/auth/login', { email, password }),
    register: (name, email, password, role) => axios.post('/auth/register', { name, email, password, role }),
    getProfile: () => axios.get('/auth/profile'),
    updatePassword: (currentPassword, newPassword) => axios.put('/auth/update-password', { currentPassword, newPassword }),
  },
  clients: {
    list: () => axios.get('/clients'),
    get: (id) => axios.get(`/clients/${id}`),
    create: (data) => axios.post('/clients', data),
    update: (id, data) => axios.put(`/clients/${id}`, data),
    delete: (id) => axios.delete(`/clients/${id}`),
  },
  documents: {
    list: (clientId = '') => axios.get(`/documents${clientId ? `?clientId=${clientId}` : ''}`),
    get: (id) => axios.get(`/documents/${id}`),
    upload: (formData, onUploadProgress) => 
      axios.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      }),
    delete: (id) => axios.delete(`/documents/${id}`),
    download: (id) => axios.get(`/documents/${id}/download`, { responseType: 'blob' }),
  },
  reviews: {
    get: (documentId) => axios.get(`/reviews/document/${documentId}`),
    analyze: (documentId) => axios.post(`/reviews/analyze/${documentId}`),
    regenerate: (reviewId) => axios.post(`/reviews/regenerate/${reviewId}`),
  },
  dashboard: {
    publicStats: () => axios.get('/dashboard/public-stats'),
    stats: () => axios.get('/dashboard/stats'),
    activity: () => axios.get('/dashboard/activity'),
    monthlyStats: () => axios.get('/dashboard/monthly-stats'),
    recentUploads: () => axios.get('/dashboard/recent-uploads'),
    recentReviews: () => axios.get('/dashboard/recent-reviews'),
  },
  reports: {
    get: (reviewId) => axios.get(`/reports/${reviewId}`),
    generate: (docId) => axios.post('/reports/generate', { documentId: docId }),
    downloadPDF: (reviewId) => axios.get(`/reports/${reviewId}/pdf`, { responseType: 'blob' }),
  },
  visits: {
    get: () => axios.get('/visits'),
    track: () => axios.post('/visits/track'),
  }
};

export default api;
