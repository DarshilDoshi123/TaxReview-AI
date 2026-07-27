import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ScrollProgress from '../components/common/ScrollProgress';
import PageTransition from '../components/common/PageTransition';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Sync dark mode settings with HTML class attribute
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to login if user is unauthenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 dark:opacity-60">
        <div className="absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-primary-500/5 blur-[150px] dark:bg-primary-500/10" />
        <div className="absolute right-[5%] top-[20%] h-[450px] w-[450px] rounded-full bg-indigo-500/5 blur-[130px] dark:bg-indigo-500/10" />
      </div>

      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content viewport */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar 
          setSidebarOpen={setSidebarOpen} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />

        {/* Dashboard page views */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 z-10">
          <div className="mx-auto max-w-7xl">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
