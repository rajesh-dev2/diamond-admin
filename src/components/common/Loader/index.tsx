import React from 'react';
import { cn } from '@/lib/utils';
import './style.css';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
  text?: string;
}

export function Loader({ size = 'md', fullPage = false, className, text }: LoaderProps) {
  const sizeClasses = {
    sm: 'common-loader-spinner-sm',
    md: 'common-loader-spinner-md',
    lg: 'common-loader-spinner-lg',
  };

  const content = (
    <div className={cn('common-loader-wrapper', className)}>
      <div className={cn('common-loader-spinner', sizeClasses[size])} />
      {text && <p className="common-loader-text">{text}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="common-loader-fullpage">{content}</div>;
  }

  return content;
}

export default Loader;
