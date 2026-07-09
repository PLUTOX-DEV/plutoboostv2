import React, { memo, useMemo, useCallback } from 'react';

export const MemoizedCard = memo(({ children, className = '', onClick }) => (
  <div className={`glass rounded-xl p-4 ${className}`} onClick={onClick}>
    {children}
  </div>
));

MemoizedCard.displayName = 'MemoizedCard';

export const MemoizedButton = memo(({ 
  children, 
  className = '', 
  onClick, 
  disabled = false,
  variant = 'primary',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600',
    secondary: 'bg-gray-700 hover:bg-gray-600',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

MemoizedButton.displayName = 'MemoizedButton';

export const useMemoizedCallback = (callback, deps) => {
  return useCallback(callback, deps);
};

export const useMemoizedValue = (value, deps) => {
  return useMemo(() => value, deps);
};
