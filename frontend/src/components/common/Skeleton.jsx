import React from 'react';

const Skeleton = ({ className = '', width, height, ...props }) => {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      {...props}
    />
  );
};

// Predefined skeleton components
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton className={`${sizes[size]} rounded-full ${className}`} />
  );
};

export const SkeletonButton = ({ className = '' }) => (
  <Skeleton className={`h-10 w-24 rounded-lg ${className}`} />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`card p-4 space-y-4 ${className}`}>
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="flex items-center space-x-2">
      <SkeletonAvatar size="sm" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export default Skeleton;