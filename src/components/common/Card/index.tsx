import React from 'react';
import { cn } from '@/lib/utils';
import './style.css';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function Card({
  title,
  subtitle,
  action,
  children,
  className,
  headerClassName,
}: CardProps) {
  return (
    <div className={cn('common-card', className)}>
      {(title || action) && (
        <div className={cn('common-card-header', headerClassName)}>
          <div>
            {typeof title === 'string' ? (
              <h3 className="common-card-title">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="common-card-subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="common-card-body">{children}</div>
    </div>
  );
}

export default Card;
