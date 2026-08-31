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

    const hasAuto = parsed.some((p) => p.num === null);
    const explicitNumeric = parsed.filter((p) => !p.isPercent && p.num !== null).map((p) => p.num as number);
    const explicitPercentTotal = parsed.reduce((sum, p) => (p.isPercent && p.num !== null ? sum + p.num : sum), 0);
    const explicitNumericTotal = explicitNumeric.reduce((sum, v) => sum + v, 0);

    const computedWidths: string[] = [];

    if (!hasAuto) {
      if (explicitNumeric.length === 0) {
        parsed.forEach((p) => {
          computedWidths.push(`${p.num}%`);
        });
      } else {
        const remainingPercent = Math.max(0, 100 - explicitPercentTotal);
        parsed.forEach((p) => {
          if (p.isPercent && p.num !== null) {
            computedWidths.push(`${p.num}%`);
          } else if (explicitNumericTotal > 0 && p.num !== null) {
            const pct = (p.num / explicitNumericTotal) * remainingPercent;
            computedWidths.push(`${Number(pct.toFixed(3))}%`);
          } else {
            computedWidths.push(`${Number((100 / columns.length).toFixed(3))}%`);
          }
        });
      }
    } else {
      const autoCount = parsed.filter((p) => p.num === null).length;
      if (explicitNumeric.length === 0 && explicitPercentTotal === 0) {
        const equalPct = Number((100 / columns.length).toFixed(3));
        parsed.forEach(() => {
          computedWidths.push(`${equalPct}%`);
        });
      } else {
        const canvasWidth = Math.max(1280, explicitNumericTotal + autoCount * 120);
        const remainingPercentForNonPercent = Math.max(0, 100 - explicitPercentTotal);
        const numericPercentTotal = (explicitNumericTotal / canvasWidth) * remainingPercentForNonPercent;
        const leftoverForAuto = Math.max(0, remainingPercentForNonPercent - numericPercentTotal);
        const perAutoPercent = autoCount > 0 ? leftoverForAuto / autoCount : 0;

        parsed.forEach((p) => {
          if (p.isPercent && p.num !== null) {
            computedWidths.push(`${p.num}%`);
          } else if (p.num !== null) {
            const pct = (p.num / canvasWidth) * remainingPercentForNonPercent;
            computedWidths.push(`${Number(pct.toFixed(3))}%`);
          } else {
            computedWidths.push(`${Number(perAutoPercent.toFixed(3))}%`);
          }
        });
      }
    }

    return columns.map((col, idx) => {
      const p = parsed[idx];
      let computedMinWidth: string | undefined = undefined;
      if (col.minWidth !== undefined) {
        computedMinWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth;
      } else if (p.num !== null && !p.isPercent) {
        computedMinWidth = `${Math.max(50, Math.min(Math.round(p.num * 0.65), 180))}px`;
      }

      return {
        width: computedWidths[idx],
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
