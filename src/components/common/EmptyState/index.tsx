import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import './style.css';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <Layers className="w-12 h-12 text-[#C98A1B]" />,
  title = 'No Data Available',
  description = 'There are currently no items or records to display in this section.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('common-empty-state', className)}>
      <div className="common-empty-state-icon-box">{icon}</div>
      <h3 className="common-empty-state-title">{title}</h3>
      <p className="common-empty-state-description">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
