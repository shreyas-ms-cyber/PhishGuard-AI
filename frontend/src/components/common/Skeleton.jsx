import React from 'react';

export const SkeletonCard = ({ className = '' }) => (
  <div className={`glass-card p-4 rounded-xl ${className}`}>
    <div className="skeleton h-6 w-3/4 mb-3" />
    <div className="skeleton h-4 w-1/2" />
  </div>
);

export const SkeletonChart = ({ className = '' }) => (
  <div className={`glass-card p-6 rounded-xl ${className}`}>
    <div className="skeleton h-5 w-40 mb-4" />
    <div className="skeleton h-48 w-full" />
  </div>
);

export const SkeletonTable = ({ rows = 5, className = '' }) => (
  <div className={`glass-card p-4 rounded-xl ${className}`}>
    <div className="space-y-3">
      <div className="skeleton h-4 w-full" />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="skeleton h-8 w-full" />
      ))}
    </div>
  </div>
);

export default { SkeletonCard, SkeletonChart, SkeletonTable };
