import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/common/AnimatedSection';
import MagneticButton from '../components/common/MagneticButton';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm();

  const newPasswordValue = watch('newPassword');

  const onSubmitPassword = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Updating security credentials...');
    try {
      const response = await api.auth.updatePassword(data.currentPassword, data.newPassword);
      toast.success(response.data?.message || 'Password updated successfully!', { id: toastId });
      reset();
    } catch (error) {
      let errorMessage = 'Failed to update password. Please check your current password.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Password update endpoint not found (404). Please ensure backend server is active.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedSection variant="fade-up" className="space-y-8 max-w-2xl mx-auto">
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Manage profile details, credentials, and authentication preferences.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile overview card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-md glass-card">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <User className="h-4.5 w-4.5 text-primary-500" />
            <span>Profile Overview</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Name</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">{user?.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Role Authorization</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2.5 py-0.5 rounded-lg mt-1 inline-block">
                  {user?.role}
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 block font-mono">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Security / Password modification card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-md glass-card">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Lock className="h-4.5 w-4.5 text-primary-500" />
            <span>Update Password</span>
          </h3>

          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  {...register('currentPassword', { required: 'Current password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm dark:border-slate-800 bg-transparent dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (value) => value === newPasswordValue || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-800 mt-6">
              <MagneticButton>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-500/20 disabled:opacity-50 transition duration-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </MagneticButton>
            </div>
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Settings;
