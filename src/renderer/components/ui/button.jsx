import React from 'react';

// 按钮组件
export const Button = ({ 
  children, 
  variant = 'primary',
  size = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'button-linear rounded-lg font-medium';
  const sizeClasses = {
    'default': 'px-4 py-2',
    'sm': 'px-3 py-1.5 text-sm',
    'lg': 'px-6 py-3',
    'icon': 'p-2'
  };
  
  const variantClasses = {
    'primary': 'button-primary',
    'secondary': 'button-secondary',
    'ghost': 'hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  ].join(' ');

  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}; 