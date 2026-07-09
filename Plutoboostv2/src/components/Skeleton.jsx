import React from 'react';

export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded ${width} ${height} ${className}`} />
);

export const CardSkeleton = () => (
  <div className="glass rounded-xl p-4 space-y-3">
    <Skeleton width="w-1/3" height="h-4" />
    <Skeleton width="w-2/3" height="h-3" />
    <Skeleton width="w-full" height="h-20" />
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton width="w-full" height="h-10" />
    <Skeleton width="w-full" height="h-8" />
    <Skeleton width="w-full" height="h-8" />
    <Skeleton width="w-full" height="h-8" />
  </div>
);

export const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton width="w-12" height="h-12" className="rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-1/3" height="h-4" />
          <Skeleton width="w-2/3" height="h-3" />
        </div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass rounded-xl p-6 space-y-4">
    <Skeleton width="w-1/4" height="h-4" />
    <div className="space-y-2 h-64">
      <Skeleton width="w-full" height="h-full" />
    </div>
  </div>
);
