import React from 'react';
import './style.css';

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
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
  footer?: React.ReactNode;
  autoDistribute?: boolean;
}

const BASE_DESKTOP_WIDTH = 1280;

/**
 * Computes proportional column styles (%) based on defined weights/pixels,
 * ensuring tables seamlessly adapt to 100% of any viewport/screen width.
 */
function computeColumnWidths<T>(columns: ColumnDef<T>[], autoDistribute: boolean = true) {
  if (!autoDistribute || columns.length === 0) {
    return columns.map((col) => ({
      width: col.width !== undefined ? String(col.width) : undefined,
      minWidth: col.minWidth !== undefined ? String(col.minWidth) : undefined,
    }));
  }

  // 1. Parse widths into numeric weights or detect percentages
  const parsed = columns.map((col) => {
    if (col.width === undefined || col.width === null || col.width === 'auto' || col.width === '') {
      return { isPercent: false, value: null };
    }
    const str = String(col.width).trim();
    if (str.endsWith('%')) {
      const pVal = parseFloat(str);
      return { isPercent: true, value: isNaN(pVal) ? null : pVal };
    }
    const pxMatch = str.match(/^([\d.]+)(px)?$/i);
    if (pxMatch) {
      const val = parseFloat(pxMatch[1]);
      return { isPercent: false, value: isNaN(val) ? null : val };
    }
    const numVal = parseFloat(str);
    return { isPercent: false, value: isNaN(numVal) ? null : numVal };
  });

  const hasAuto = parsed.some((p) => p.value === null);
  const explicitNumeric = parsed.filter((p) => !p.isPercent && p.value !== null).map((p) => p.value as number);
  const explicitPercentTotal = parsed.reduce((sum, p) => (p.isPercent && p.value !== null ? sum + p.value : sum), 0);
  const explicitNumericTotal = explicitNumeric.reduce((sum, v) => sum + v, 0);

  const computedWidths: string[] = [];

  if (!hasAuto) {
    // SCENARIO 1: ALL columns have explicit widths (px or %)
    if (explicitNumeric.length === 0) {
      // All are percentages
      parsed.forEach((p) => {
        computedWidths.push(`${p.value}%`);
      });
    } else {
      // Distribute proportionally based on relative pixel weights
      const remainingPercent = Math.max(0, 100 - explicitPercentTotal);
      parsed.forEach((p) => {
        if (p.isPercent && p.value !== null) {
          computedWidths.push(`${p.value}%`);
        } else if (explicitNumericTotal > 0 && p.value !== null) {
          const pct = (p.value / explicitNumericTotal) * remainingPercent;
          computedWidths.push(`${Number(pct.toFixed(3))}%`);
        } else {
          computedWidths.push(`${Number((100 / columns.length).toFixed(3))}%`);
        }
      });
    }
  } else {
    // SCENARIO 2: At least one column is 'auto' or undefined
    const autoCount = parsed.filter((p) => p.value === null).length;

    if (explicitNumeric.length === 0 && explicitPercentTotal === 0) {
      // All columns are auto -> equal split
      const equalPct = Number((100 / columns.length).toFixed(3));
      parsed.forEach(() => {
        computedWidths.push(`${equalPct}%`);
      });
    } else {
      // Mix of explicit widths (px / %) and auto columns
      // Reference against the base desktop canvas width (1280px)
      const canvasWidth = Math.max(BASE_DESKTOP_WIDTH, explicitNumericTotal + autoCount * 120);
      const remainingPercentForNonPercent = Math.max(0, 100 - explicitPercentTotal);

      const numericPercentTotal = (explicitNumericTotal / canvasWidth) * remainingPercentForNonPercent;
      const leftoverForAuto = Math.max(0, remainingPercentForNonPercent - numericPercentTotal);
      const perAutoPercent = autoCount > 0 ? leftoverForAuto / autoCount : 0;

      parsed.forEach((p) => {
        if (p.isPercent && p.value !== null) {
          computedWidths.push(`${p.value}%`);
        } else if (p.value !== null) {
          const pct = (p.value / canvasWidth) * remainingPercentForNonPercent;
          computedWidths.push(`${Number(pct.toFixed(3))}%`);
        } else {
          computedWidths.push(`${Number(perAutoPercent.toFixed(3))}%`);
        }
      });
    }
  }

  // 3. Compute safe minWidth for responsiveness
  return columns.map((col, idx) => {
    const p = parsed[idx];
    let computedMinWidth: string | undefined = undefined;

    if (col.minWidth !== undefined) {
      computedMinWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth;
    } else if (p.value !== null && !p.isPercent) {
      computedMinWidth = `${Math.max(50, Math.min(Math.round(p.value * 0.65), 180))}px`;
    }

    return {
      width: computedWidths[idx],
      minWidth: computedMinWidth,
    };
  });
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = 'No data available in table',
  isLoading = false,
  className = '',
  onRowClick,
  footer,
  autoDistribute = true,
}: DataTableProps<T>) {
  const colStyles = React.useMemo(() => computeColumnWidths(columns, autoDistribute), [columns, autoDistribute]);

  return (
    <div className={`common-datatable-container ${className}`}>
      <table className="common-datatable-table">
        <colgroup>
          {columns.map((_, idx) => (
            <col key={idx} style={{ width: colStyles[idx]?.width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="common-datatable-header-tr">
            {columns.map((col, idx) => {
              const style = colStyles[idx];
              return (
                <th
                  key={idx}
                  style={style ? { width: style.width, minWidth: style.minWidth } : undefined}
                  className={`common-datatable-th ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                >
                  <div
                    className={`common-datatable-th-inner ${col.align === 'right'
                        ? 'justify-end w-full'
                        : col.align === 'center'
                          ? 'justify-center w-full'
                          : ''
                      }`}
                  >
                    <span>{col.header}</span>
                  </div>
                </th>
              );
            })}
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
                className={`common-datatable-tr ${rowIdx % 2 === 1 ? 'common-datatable-tr-alt' : ''} ${onRowClick ? 'cursor-pointer' : ''
                  }`}
              >
                {columns.map((col, colIdx) => {
                  const style = colStyles[colIdx];
                  return (
                    <td
                      key={colIdx}
                      style={style ? { width: style.width, minWidth: style.minWidth } : undefined}
                      className={`common-datatable-td ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                    >
                      {col.render ? col.render(row) : row[col.key] ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
        {footer && (
          <tfoot role="rowgroup" className="common-datatable-tfoot">
            {footer}
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default DataTable;
