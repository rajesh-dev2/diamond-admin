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

  // Parse widths into numeric weights or detect percentages
  const parsed = columns.map((col) => {
    if (col.width === undefined || col.width === null || col.width === 'auto' || col.width === '') {
      return { raw: col.width, num: null, isPercent: false };
    }
    const str = String(col.width).trim();
    if (str.endsWith('%')) {
      const pVal = parseFloat(str);
      return { raw: col.width, num: isNaN(pVal) ? null : pVal, isPercent: true };
    }
    const pxMatch = str.match(/^([\d.]+)(px)?$/i);
    if (pxMatch) {
      const val = parseFloat(pxMatch[1]);
      return { raw: col.width, num: isNaN(val) ? null : val, isPercent: false };
    }
    const numVal = parseFloat(str);
    return { raw: col.width, num: isNaN(numVal) ? null : numVal, isPercent: false };
  });

  const numericWeights = parsed.filter((p) => !p.isPercent && p.num !== null).map((p) => p.num as number);
  const totalExplicitPx = numericWeights.reduce((sum, val) => sum + val, 0);
  const avgWeight = numericWeights.length > 0 ? totalExplicitPx / numericWeights.length : 100;

  // Resolve weight for each column
  const effectiveWeights = parsed.map((p) => {
    if (p.isPercent) return null; // handled via fixed percentage
    return p.num !== null && p.num > 0 ? p.num : avgWeight;
  });

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

    // Determine minWidth: if explicit minWidth is provided use it, otherwise provide a safe minWidth
    // based on original pixel width or a floor to prevent column destruction
    let computedMinWidth: string | undefined = undefined;
    if (col.minWidth !== undefined) {
      computedMinWidth = typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth;
    } else if (p.num !== null && !p.isPercent) {
      // Allow slight contraction but retain readable floor (min 50px, or 60% of original px)
      computedMinWidth = `${Math.max(50, Math.min(Math.round(p.num * 0.65), 180))}px`;
    }

    return {
      width: computedWidthPercent,
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
