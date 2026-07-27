import React from 'react';

export const SkeletonCard = ({ className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
    <div className="space-y-2 pt-2">
      <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-pulse ${className}`}>
    <div className="h-12 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800" />
    <div className="divide-y divide-slate-100 dark:divide-slate-800 p-4 space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between pt-2">
          <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/6 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart = ({ className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse space-y-4 ${className}`}>
    <div className="flex justify-between items-center">
      <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
    <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40" />
  </div>
);

export const SkeletonReport = ({ className = '' }) => (
  <div className={`rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-pulse space-y-6 ${className}`}>
    <div className="h-28 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 p-8" />
    <div className="p-8 space-y-6">
      <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-950" />
        <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-950" />
      </div>
      <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-950" />
    </div>
  </div>
);
