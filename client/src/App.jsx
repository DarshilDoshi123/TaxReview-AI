import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { FileText } from 'lucide-react';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import DocumentUpload from './pages/DocumentUpload';
import DocumentDetail from './pages/DocumentDetail';
import Settings from './pages/Settings';
import ReviewReport from './pages/ReviewReport';
import PendingReviews from './pages/PendingReviews';
import { trackVisitOnLoad } from './utils/visitTracker';

// Lazy Loaded Public Components
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const Home = lazy(() => import('./pages/public/Home'));
const Features = lazy(() => import('./pages/public/Features'));
const SupportedDocuments = lazy(() => import('./pages/public/SupportedDocuments'));
const IncomeTaxGuide = lazy(() => import('./pages/public/IncomeTaxGuide'));
const FAQ = lazy(() => import('./pages/public/Faq'));
const Developer = lazy(() => import('./pages/public/Developer'));
const Privacy = lazy(() => import('./pages/public/Privacy'));
const Terms = lazy(() => import('./pages/public/Terms'));
const Blog = lazy(() => import('./pages/public/Blog'));
const BlogArticle = lazy(() => import('./pages/public/BlogArticle'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Global Spinner for Suspense & Loading
const PageSpinner = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
    <div className="rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-3 shadow-md shadow-primary-500/20 animate-pulse">
      <FileText className="h-6 w-6 text-white" />
    </div>
    <div className="flex items-center space-x-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-ping" />
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Loading TaxReview AI</span>
    </div>
  </div>
);

// Helper component to guard private routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <PageSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Root Router Layout Switcher
const RootRouteElement = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  // If user is authenticated, render secure DashboardLayout, else render public layout
  return user ? (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ) : (
    <PublicLayout />
  );
};

// Root Route Index Switcher
const RootIndexElement = () => {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Home />;
};

// Scroll to Top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  useEffect(() => {
    trackVisitOnLoad();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            {/* Conditional Root Switch & Dashboard Sub-routes */}
            <Route path="/" element={<RootRouteElement />}>
              <Route index element={<RootIndexElement />} />
              
              {/* Authenticated Dashboard Nested Routes */}
              <Route 
                path="clients" 
                element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="clients/:id" 
                element={
                  <ProtectedRoute>
                    <ClientDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="upload" 
                element={
                  <ProtectedRoute>
                    <DocumentUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reviews/pending" 
                element={
                  <ProtectedRoute>
                    <PendingReviews />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="documents/:id" 
                element={
                  <ProtectedRoute>
                    <DocumentDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reports/:reviewId" 
                element={
                  <ProtectedRoute>
                    <ReviewReport />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Always Accessible Public Information Pages */}
            <Route element={<PublicLayout />}>
              <Route path="features" element={<Features />} />
              <Route path="supported-documents" element={<SupportedDocuments />} />
              <Route path="income-tax-guide" element={<IncomeTaxGuide />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogArticle />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="developer" element={<Developer />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>

            {/* Public Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Fallback for invalid paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
          }
        }} 
      />
    </AuthProvider>
  );
}

export default App;
