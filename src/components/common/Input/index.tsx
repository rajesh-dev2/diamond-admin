import React from 'react';
import { cn } from '@/lib/utils';
import './style.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="common-input-wrapper">
        {label && <label className="common-input-label">{label}</label>}
        <div className="common-input-relative">
          {leftIcon && <div className="common-input-left-icon">{leftIcon}</div>}
          <input
            type={type}
            className={cn(
              'common-input-element',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && <div className="common-input-right-icon">{rightIcon}</div>}
        </div>
        {error && <span className="common-input-error-text">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
