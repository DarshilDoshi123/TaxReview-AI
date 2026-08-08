import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, User, Mail, Lock, Briefcase, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import PageBackground from '../components/common/PageBackground';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [authError, setAuthError] = useState(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setAuthError(null);
    const loadingToast = toast.loading('Creating user profile...');

    const result = await register(data.name, data.email, data.password, data.role);
    
    toast.dismiss(loadingToast);

    if (result.success) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 250);
    } else {
      setIsSubmitting(false);
      const errorMsg = result.error || 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (isTransitioning) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center space-y-6 select-none animate-fade-in">
        <div className="rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-4 shadow-lg shadow-primary-500/25 animate-pulse">
          <FileText className="h-10 w-10 text-white" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight animate-pulse">Initializing Workspace...</h2>
          <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-ping" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Securing session credentials</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Centralized Auth Background System */}
      <PageBackground variant="auth" />

      {/* Back to Website link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-xl px-3.5 py-2 bg-white/80 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700/60 backdrop-blur-md"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Website</span>
      </Link>

      {/* Register Card */}
      <div className="w-full max-w-md space-y-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative z-10 animate-fade-in">
        <div>
          <div className="flex justify-center">
            <div className="rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-3.5 shadow-lg shadow-primary-500/25">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            TaxReview <span className="bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">AI</span>
          </h2>
          <p className="mt-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Create practitioner or client account
          </p>
        </div>

        {/* Authentication Error Banner */}
        {authError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs flex items-center space-x-3 shadow-lg shadow-red-500/5 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="font-semibold leading-relaxed">{authError}</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <User className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="John Doe"
                  {...registerField('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-semibold text-red-500 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200 ${
                    errors.email || authError ? 'border-red-500/80 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="john@example.com"
                  {...registerField('email', {
                    required: 'Email is required',
                    onChange: () => authError && setAuthError(null),
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-red-500 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                User Role
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Briefcase className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>
                <select
                  id="role"
                  className="block w-full rounded-xl border bg-slate-50 dark:bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200 border-slate-200 dark:border-slate-800 appearance-none cursor-pointer"
                  {...registerField('role')}
                >
                  <option value="CA" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm">CA / Auditor (Chartered Accountant)</option>
                  <option value="Client" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm">Taxpayer / Client</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  <svg className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-950/60 py-3 pl-11 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200 ${
                    errors.password || authError ? 'border-red-500/80 focus:ring-red-500/50' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="••••••••"
                  {...registerField('password', {
                    required: 'Password is required',
                    onChange: () => authError && setAuthError(null),
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-red-500 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white hover:from-primary-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:scale-[1.01] active:scale-98 shadow-lg shadow-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Creating Profile...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
