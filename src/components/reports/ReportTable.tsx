import React, { useState, useMemo } from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

export interface ReportTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export function ReportTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = 'No data available in table',
  isLoading = false,
}: ReportTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable === false) return;
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      let res = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        res = valA - valB;
      } else {
        res = String(valA).localeCompare(String(valB));
      }
      return sortOrder === 'asc' ? res : -res;
    });
  }, [data, sortKey, sortOrder]);

  const renderSortIcon = (colKey: string) => {
    if (sortKey !== colKey) return null;

    const isAsc = sortOrder === 'asc';
    const isDesc = sortOrder === 'desc';

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        viewBox="0 0 101 101"
        preserveAspectRatio="none"
        className="inline-block ml-1 shrink-0 align-middle"
      >
        <path
          fill="currentColor"
          opacity={isAsc ? '1' : '.3'}
          d="M51 1l25 23 24 22H1l25-22z"
        />
        <path
          fill="currentColor"
          opacity={isDesc ? '1' : '.3'}
          d="M51 101l25-23 24-22H1l25 22z"
        />
      </svg>
    );
  };

  return (
    <div className="report-table-container overflow-x-auto">
      <table className="report-table">
        <colgroup>
          {columns.map((col, idx) => (
            <col key={idx} style={{ width: col.width || 'auto' }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col, idx) => {
              const isSortable = col.sortable !== false;
              return (
                <th
                  key={idx}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${isSortable ? 'cursor-pointer select-none' : ''
                    }`}
                >
                  <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end w-full' : col.align === 'center' ? 'justify-center w-full' : ''
                    }`}>
                    <span>{col.header}</span>
                    {isSortable && renderSortIcon(col.key)}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={columns.length} className="text-center py-4 text-[#888888]">
                  Loading report data...
                </td>
              </tr>
            ))
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5 text-[#666666]">
                <p className="mb-0">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
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

export default ReportTable;
