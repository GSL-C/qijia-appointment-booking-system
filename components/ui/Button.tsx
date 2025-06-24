'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  isPressed?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, isPressed = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200';
    
    const variants = {
      primary: 'bg-[var(--qijia-yellow)] text-[#222222] hover:bg-[#f4c861] shadow-md hover:shadow-lg',
      secondary: 'bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#f9f9f9]',
      outline: 'border border-[#DDDDDD] text-[#222222] hover:bg-[#f9f9f9]',
      ghost: 'text-[#222222] hover:bg-[#f9f9f9]',
      danger: 'bg-[var(--soft-red)] text-[#222222] hover:bg-[#e85a4a] shadow-md hover:shadow-lg'
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded',
      md: 'px-4 py-2 text-sm rounded',
      lg: 'px-6 py-3 text-base rounded'
    };

    // Add pressed state class if button is pressed
    const pressedClass = isPressed ? 'shadow-inner' : '';

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], pressedClass, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 