import React from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  width?: string | number;
  minWidth?: string | number;
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
  const colStyles = React.useMemo(() => {
    if (columns.length === 0) return [];
    const parsed = columns.map((col) => {
      if (col.width === undefined || col.width === null || col.width === 'auto' || col.width === '') {
        return { num: null, isPercent: false };
      }
      const str = String(col.width).trim();
      if (str.endsWith('%')) {
        const pVal = parseFloat(str);
        return { num: isNaN(pVal) ? null : pVal, isPercent: true };
      }
      const pxMatch = str.match(/^([\d.]+)(px)?$/i);
      if (pxMatch) {
        const val = parseFloat(pxMatch[1]);
        return { num: isNaN(val) ? null : val, isPercent: false };
      }
      const numVal = parseFloat(str);
      return { num: isNaN(numVal) ? null : numVal, isPercent: false };
    });

    const numericWeights = parsed.filter((p) => !p.isPercent && p.num !== null).map((p) => p.num as number);
    const totalExplicitPx = numericWeights.reduce((sum, val) => sum + val, 0);
    const avgWeight = numericWeights.length > 0 ? totalExplicitPx / numericWeights.length : 100;
    const effectiveWeights = parsed.map((p) => (p.isPercent ? null : p.num !== null && p.num > 0 ? p.num : avgWeight));
    const totalPercentExplicit = parsed.reduce((sum, p) => (p.isPercent && p.num ? sum + p.num : sum), 0);
    const remainingPercent = Math.max(0, 100 - totalPercentExplicit);
    const totalWeightForRemaining = effectiveWeights.reduce((sum, w) => (w !== null ? sum + w : sum), 0);

    return columns.map((col, idx) => {
      const p = parsed[idx];
      let computedWidthPercent: string;
      if (p.isPercent && p.num !== null) {
        computedWidthPercent = `${p.num}%`;
      } else if (totalWeightForRemaining > 0 && effectiveWeights[idx] !== null) {
        const weight = effectiveWeights[idx] as number;
        const pct = (weight / totalWeightForRemaining) * remainingPercent;
        computedWidthPercent = `${Number(pct.toFixed(3))}%`;
      } else {
        computedWidthPercent = `${Number((100 / columns.length).toFixed(3))}%`;
      }

      let computedMinWidth: string | undefined = undefined;
      if (col.minWidth !== undefined) {
        computedMinWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth;
      } else if (p.num !== null && !p.isPercent) {
        computedMinWidth = `${Math.max(50, Math.min(Math.round(p.num * 0.65), 180))}px`;
      }

      return {
        width: computedWidthPercent,
        minWidth: computedMinWidth,
      };
    });
  }, [columns]);

  return (
    <div className="report-table-container overflow-x-auto">
      <table className="report-table w-full" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          {columns.map((_, idx) => (
            <col key={idx} style={{ width: colStyles[idx]?.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col, idx) => {
              const style = colStyles[idx];
              return (
                <th
                  key={idx}
                  style={style ? { width: style.width, minWidth: style.minWidth } : undefined}
                  className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                >
                <div
                  className={`inline-flex items-center gap-1 ${
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
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={columns.length} className="text-center py-4 text-[#888888]">
                  Loading report data...
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5 text-[#666666]">
                <p className="mb-0">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => {
                  const style = colStyles[colIdx];
                  return (
                    <td
                      key={colIdx}
                      style={style ? { width: style.width, minWidth: style.minWidth } : undefined}
                      className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    >
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
