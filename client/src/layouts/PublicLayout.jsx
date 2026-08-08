import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollProgress from '../components/common/ScrollProgress';
import PageTransition from '../components/common/PageTransition';
import { 
  FileText, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronRight, 
  ShieldCheck 
} from 'lucide-react';

import PageBackground from '../components/common/PageBackground';

const PublicLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Keep dark mode synced with document.documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Supported Docs', path: '/supported-documents' },
    { name: 'Tax Guide', path: '/income-tax-guide' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Developer', path: '/developer' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Centralized Public Page Background System */}
      <PageBackground variant="public" />

      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 px-4 md:px-8 py-3.5 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80 transition-all">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 z-50">
            <div className="rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-2 shadow-md shadow-primary-500/20">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              TaxReview <span className="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-100/80 text-primary-600 dark:bg-slate-900/80 dark:text-primary-400'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/40'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all duration-200"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* User dashboard / Login indicators */}
            {user ? (
              <Link
                to="/"
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Dashboard</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Trigger & Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 inset-x-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col space-y-4 shadow-2xl z-40"
            >
              <nav className="flex flex-col space-y-1.5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900/60'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              <div className="h-px bg-slate-100 dark:bg-slate-900 my-2" />

              <div className="flex flex-col space-y-3 pt-2">
                {user ? (
                  <Link
                    to="/"
                    className="w-full text-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/20"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Public Pages Viewport Outlet */}
      <main className="flex-grow z-10 relative">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* Premium Public Footer */}
      <footer className="z-10 border-t border-slate-200 bg-white/40 dark:border-slate-900 dark:bg-slate-950/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Tagline Widget */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-2 shadow-md shadow-primary-500/20">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  TaxReview <span className="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">AI</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Empowering individuals, tax consultants, and accountants with secure, high-precision AI auditing for Indian Income Tax documents.
              </p>
            </div>

            {/* Nav Columns */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/features" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Features</Link></li>
                <li><Link to="/" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">How It Works</Link></li>
                <li><Link to="/supported-documents" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Supported Documents</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/income-tax-guide" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Income Tax Guide</Link></li>
                <li><Link to="/faq" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">FAQ Support</Link></li>
                <li><Link to="/blog" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Platform Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/privacy" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/developer" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors">Work With Me</Link></li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-900 my-12" />

          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} TaxReview AI. All rights reserved. | Designed & Developed by Darshil Doshi</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
