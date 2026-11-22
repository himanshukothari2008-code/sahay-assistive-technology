import React from 'react';

/**
 * Accessible Button Component
 * Compliant with WCAG 2.2 AA target size (minimum 44x44px) and visible focus rings.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ariaLabel,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:cursor-not-allowed touch-target';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline: 'border-2 border-slate-300 bg-transparent text-slate-800 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-300 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800',
    yellow: 'bg-yellow-400 text-black hover:bg-yellow-500 font-bold border-2 border-black'
  };

  const sizes = {
    sm: 'text-sm px-3 py-2 min-h-[44px]',
    md: 'text-base px-4 py-2.5 min-h-[44px]',
    lg: 'text-lg px-6 py-3 min-h-[48px]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2 shrink-0" aria-hidden="true" />}
    </button>
  );
}

export default Button;
