import React from 'react';
import { TableColumn } from '@/types/common.types';
import { cn } from '@/lib/utils';
import './style.css';

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyText?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  isLoading,
  emptyText = 'No data available',
  className,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className={cn('common-table-container', className)}>
      <table className="common-table-element">
        <thead className="common-table-thead">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('common-table-th', col.align === 'center' && 'text-center', col.align === 'right' && 'text-right')}
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 text-sm">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'common-table-tr',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('common-table-td', col.align === 'center' && 'text-center', col.align === 'right' && 'text-right')}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
