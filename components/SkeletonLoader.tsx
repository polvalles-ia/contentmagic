
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
      <div className="animate-pulse flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="flex-grow space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
