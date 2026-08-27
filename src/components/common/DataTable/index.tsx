import React from 'react';
import './style.css';

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = 'No data available in table',
  isLoading = false,
  className = '',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={`common-datatable-container ${className}`}>
      <table className="common-datatable-table">
        <colgroup>
          {columns.map((col, idx) => (
            <col key={idx} style={{ width: col.width || 'auto' }} />
          ))}
        </colgroup>
        <thead>
          <tr className="common-datatable-header-tr">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`common-datatable-th ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                }`}
              >
                <div
                  className={`common-datatable-th-inner ${
                    col.align === 'right'
                      ? 'justify-end w-full'
                      : col.align === 'center'
                      ? 'justify-center w-full'
                      : ''
                  }`}
                >
                  <span>{col.header}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="animate-pulse">
              <td colSpan={columns.length} className="common-datatable-loading-td">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="common-datatable-empty-td">
                <p className="mb-0">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`common-datatable-tr ${rowIdx % 2 === 1 ? 'common-datatable-tr-alt' : ''} ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`common-datatable-td ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
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

export default DataTable;
