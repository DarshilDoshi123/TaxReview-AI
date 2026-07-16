import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Sun, Moon, User, LogOut, ChevronDown, FileText } from 'lucide-react';

const Navbar = ({ setSidebarOpen, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-6 select-none animate-fade-in">
        <div className="rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-4 shadow-lg shadow-primary-500/25 animate-pulse">
          <FileText className="h-10 w-10 text-white" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Signing Out</h2>
          <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Clearing session credentials</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/70 px-8 backdrop-blur-xl dark:border-slate-900/80 dark:bg-slate-950/70">
      
      {/* Left side mobile menu trigger */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-tight">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</span>
          </h2>
        </div>
      </div>
 
      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode toggle button */}
        <button
          onClick={toggleDarkMode}
          className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-all duration-200 hover:scale-105 active:scale-95"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
 
        {/* User profile popover */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
          >
            {/* User Initials Circle */}
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-primary-500/25">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
            </div>
            
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.name}</p>
              <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-full mt-1.5 inline-block tracking-wider uppercase">
                {user?.role}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200" />
          </button>
 
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-52 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur-md z-20 animate-scale-up">
                <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Email Address</p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-300 mt-1 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsLoggingOut(true);
                    setTimeout(() => {
                      navigate('/');
                      logout();
                    }, 250);
                  }}
                  className="flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 dark:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
