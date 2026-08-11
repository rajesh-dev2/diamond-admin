import React from 'react';
import { cn } from '@/lib/utils';
import './style.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'live';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantClasses = {
    default: 'common-badge-default',
    success: 'common-badge-success',
    warning: 'common-badge-warning',
    danger: 'common-badge-danger',
    info: 'common-badge-info',
    live: 'common-badge-live',
  };

  return (
    <span className={cn('common-badge', variantClasses[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
