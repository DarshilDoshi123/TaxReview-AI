import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon,
  title = 'No records found',
  description = 'There are no items matching your request.',
  actionText,
  onActionClick,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto space-y-4 ${className}`}
    >
      {Icon && (
        <div className="mx-auto h-14 w-14 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-500/20">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {description}
        </p>
      </div>
      {actionText && onActionClick && (
        <div className="pt-2">
          <button
            onClick={onActionClick}
            className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:from-primary-500 hover:to-indigo-500 shadow-md shadow-primary-500/25 transition active:scale-95 duration-150"
          >
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
