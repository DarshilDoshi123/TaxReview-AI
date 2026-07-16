import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FileText, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Authenticating credentials...');
    
    const result = await login(data.email, data.password);
    
    toast.dismiss(loadingToast);
    
    if (result.success) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
      }, 250);
    } else {
      setIsSubmitting(false);
      toast.error(result.error);
    }
  };

  if (isTransitioning) {
    return (
      <div className="fixed inset-0 z-50 bg-[#09090e] flex flex-col items-center justify-center space-y-6 select-none animate-fade-in">
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
    <div className="flex min-h-screen items-center justify-center bg-[#09090e] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Back to Website link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-xl px-3 py-2 bg-slate-950/40 border border-slate-800/40 hover:border-slate-700/60"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Website</span>
      </Link>

      {/* Ambient background glowing decorations */}
      <div className="absolute top-[-20%] left-[-10%] h-[550px] w-[550px] rounded-full bg-primary-600/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[550px] w-[550px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md space-y-8 glass p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative z-10 animate-fade-in">
        <div>
          <div className="flex justify-center">
            <div className="rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-3.5 shadow-lg shadow-primary-500/25">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
            TaxReview <span className="bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
          </h2>
          <p className="mt-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Secure Tax Auditing Portal
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-800'
                  }`}
                  placeholder="name@company.com"
                  {...registerField('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`block w-full rounded-xl border bg-slate-950/60 py-3 pl-11 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-800'
                  }`}
                  placeholder="••••••••"
                  {...registerField('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white hover:from-primary-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:scale-[1.01] active:scale-98 shadow-lg shadow-primary-950/20 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Verifying Session...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs font-semibold text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-400 hover:text-primary-300 transition-colors">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
