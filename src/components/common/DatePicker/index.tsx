import React, { useState, useRef, useEffect } from 'react';
import './style.css';

export interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  clearable?: boolean;
  format?: string;
  range?: boolean;
}

const parseDateString = (val: string): Date => {
  if (!val) return new Date();
  const trimmed = val.trim();
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y) && m >= 0 && m < 12) {
        return new Date(y, m, d);
      }
    }
  } else if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && m >= 0 && m < 12) {
          return new Date(y, m, d);
        }
      } else {
        const d = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && m >= 0 && m < 12) {
          return new Date(y, m, d);
        }
      }
    }
  }
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const parseRangeString = (val: string): [Date, Date] => {
  if (!val) {
    const today = new Date();
    return [today, today];
  }
  let parts: string[] = [];
  if (val.includes(' - ')) {
    parts = val.split(' - ');
  } else if (val.includes(' ~ ')) {
    parts = val.split(' ~ ');
  } else {
    parts = [val, val];
  }
  const d1 = parseDateString(parts[0]);
  const d2 = parts[1] ? parseDateString(parts[1]) : d1;
  return [d1, d2];
};

const formatDateString = (date: Date, format: string = 'DD/MM/YYYY'): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  if (format === 'YYYY-MM-DD') return `${y}-${m}-${d}`;
  return `${d}/${m}/${y}`;
};

const isSameDay = (d1: Date | null, d2: Date | null): boolean => {
  if (!d1 || !d2) return false;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const getCalendarDays = (year: number, month: number) => {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: { date: Date; day: number; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    days.push({
      date: new Date(year, month - 1, dayNum),
      day: dayNum,
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      day: d,
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let d = 1; d <= remainingDays; d++) {
    days.push({
      date: new Date(year, month + 1, d),
      day: d,
      isCurrentMonth: false,
    });
  }

  const dayRows: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    dayRows.push(days.slice(i, i + 7));
  }
  return dayRows;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  name = 'date',
  clearable = true,
  format = 'DD/MM/YYYY',
  range = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'date' | 'month' | 'year'>('date');
  const containerRef = useRef<HTMLDivElement>(null);

  // Single date state
  const [viewDate, setViewDate] = useState<Date>(() => parseDateString(value));

  // Range state
  const initialRange = range ? parseRangeString(value) : [new Date(), new Date()];
  const [leftViewDate, setLeftViewDate] = useState<Date>(() => {
    const [start] = parseRangeString(value);
    return new Date(start.getFullYear(), start.getMonth(), 1);
  });
  const [rightViewDate, setRightViewDate] = useState<Date>(() => {
    const [start] = parseRangeString(value);
    const m = start.getMonth() + 1;
    const y = m > 11 ? start.getFullYear() + 1 : start.getFullYear();
    return new Date(y, m % 12, 1);
  });

  const [rangeStart, setRangeStart] = useState<Date | null>(() => (range ? initialRange[0] : null));
  const [rangeEnd, setRangeEnd] = useState<Date | null>(() => (range ? initialRange[1] : null));
  const [selectingStart, setSelectingStart] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    if (range) {
      const [s, e] = parseRangeString(value);
      setRangeStart(s);
      setRangeEnd(e);
      setLeftViewDate(new Date(s.getFullYear(), s.getMonth(), 1));
      const nextM = s.getMonth() + 1;
      const nextY = nextM > 11 ? s.getFullYear() + 1 : s.getFullYear();
      setRightViewDate(new Date(nextY, nextM % 12, 1));
    } else {
      setViewDate(parseDateString(value));
    }
  }, [value, range]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setCurrentView('date');
        setSelectingStart(null);
        setHoverDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date();
  const isToday = (d: Date) => isSameDay(d, today);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Single date handlers
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'short' });

  const handlePrevYear = () => {
    if (currentView === 'year') {
      setViewDate(new Date(year - 10, month, 1));
    } else {
      setViewDate(new Date(year - 1, month, 1));
    }
  };

  const handleNextYear = () => {
    if (currentView === 'year') {
      setViewDate(new Date(year + 10, month, 1));
    } else {
      setViewDate(new Date(year + 1, month, 1));
    }
  };

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelectDate = (d: Date) => {
    setViewDate(d);
    onChange(formatDateString(d, format));
    setIsOpen(false);
    setCurrentView('date');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setRangeStart(null);
    setRangeEnd(null);
    setSelectingStart(null);
  };

  // Range calendar navigation
  const leftYear = leftViewDate.getFullYear();
  const leftMonth = leftViewDate.getMonth();
  const leftMonthName = leftViewDate.toLocaleString('default', { month: 'short' });

  const rightYear = rightViewDate.getFullYear();
  const rightMonth = rightViewDate.getMonth();
  const rightMonthName = rightViewDate.toLocaleString('default', { month: 'short' });

  const handleLeftPrevYear = () => setLeftViewDate(new Date(leftYear - 1, leftMonth, 1));
  const handleLeftNextYear = () => setLeftViewDate(new Date(leftYear + 1, leftMonth, 1));
  const handleLeftPrevMonth = () => setLeftViewDate(new Date(leftYear, leftMonth - 1, 1));
  const handleLeftNextMonth = () => setLeftViewDate(new Date(leftYear, leftMonth + 1, 1));

  const handleRightPrevYear = () => setRightViewDate(new Date(rightYear - 1, rightMonth, 1));
  const handleRightNextYear = () => setRightViewDate(new Date(rightYear + 1, rightMonth, 1));
  const handleRightPrevMonth = () => setRightViewDate(new Date(rightYear, rightMonth - 1, 1));
  const handleRightNextMonth = () => setRightViewDate(new Date(rightYear, rightMonth + 1, 1));

  const handleRangeClickDate = (d: Date) => {
    if (!selectingStart) {
      setSelectingStart(d);
      setHoverDate(d);
    } else {
      let start = selectingStart;
      let end = d;
      if (start.getTime() > end.getTime()) {
        [start, end] = [end, start];
      }
      setRangeStart(start);
      setRangeEnd(end);
      onChange(`${formatDateString(start, format)} - ${formatDateString(end, format)}`);
      setSelectingStart(null);
      setHoverDate(null);
      setIsOpen(false);
    }
  };

  // Range day class determination
  const getRangeDayClass = (d: Date) => {
    let effectiveStart = rangeStart;
    let effectiveEnd = rangeEnd;

    if (selectingStart) {
      effectiveStart = selectingStart;
      effectiveEnd = hoverDate || selectingStart;
      if (effectiveStart && effectiveEnd && effectiveStart.getTime() > effectiveEnd.getTime()) {
        [effectiveStart, effectiveEnd] = [effectiveEnd, effectiveStart];
      }
    }

    const startMatch = isSameDay(d, effectiveStart);
    const endMatch = isSameDay(d, effectiveEnd);

    if (startMatch && endMatch) return 'active range-start range-end';
    if (startMatch) return 'active range-start';
    if (endMatch) return 'active range-end';

    if (effectiveStart && effectiveEnd) {
      const dTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const sTime = new Date(effectiveStart.getFullYear(), effectiveStart.getMonth(), effectiveStart.getDate()).getTime();
      const eTime = new Date(effectiveEnd.getFullYear(), effectiveEnd.getMonth(), effectiveEnd.getDate()).getTime();
      if (dTime > sTime && dTime < eTime) {
        return 'in-range';
      }
    }
    return '';
  };

  const renderCalendarTable = (yearNum: number, monthNum: number, isLeft: boolean) => {
    const days = getCalendarDays(yearNum, monthNum);
    return (
      <div className="mx-range-calendar">
        <div className="mx-calendar-header">
          <button
            type="button"
            onClick={isLeft ? handleLeftPrevYear : handleRightPrevYear}
            className="mx-btn mx-btn-text mx-btn-icon-double-left"
          >
            &laquo;
          </button>
          <button
            type="button"
            onClick={isLeft ? handleLeftPrevMonth : handleRightPrevMonth}
            className="mx-btn mx-btn-text mx-btn-icon-left"
          >
            &lsaquo;
          </button>
          <span className="mx-calendar-header-label">
            <span className="font-semibold text-[#47698a]">{months[monthNum]} {yearNum}</span>
          </span>
          <button
            type="button"
            onClick={isLeft ? handleLeftNextMonth : handleRightNextMonth}
            className="mx-btn mx-btn-text mx-btn-icon-right"
          >
            &rsaquo;
          </button>
          <button
            type="button"
            onClick={isLeft ? handleLeftNextYear : handleRightNextYear}
            className="mx-btn mx-btn-text mx-btn-icon-double-right"
          >
            &raquo;
          </button>
        </div>
        <table className="mx-table mx-table-date">
          <thead>
            <tr>
              <th>Su</th>
              <th>Mo</th>
              <th>Tu</th>
              <th>We</th>
              <th>Th</th>
              <th>Fr</th>
              <th>Sa</th>
            </tr>
          </thead>
          <tbody>
            {days.map((row, rIdx) => (
              <tr key={rIdx} className="mx-date-row">
                {row.map((item, cIdx) => {
                  const rangeClass = getRangeDayClass(item.date);
                  const todayClass = isToday(item.date) ? 'today' : '';
                  const notCurrentClass = !item.isCurrentMonth ? 'not-current-month' : '';
                  return (
                    <td
                      key={cIdx}
                      onClick={() => handleRangeClickDate(item.date)}
                      onMouseEnter={() => selectingStart && setHoverDate(item.date)}
                      className={`cell ${notCurrentClass} ${todayClass} ${rangeClass}`}
                    >
                      {item.day}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const startYear = Math.floor(year / 10) * 10 - 1;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);
  const singleDays = getCalendarDays(year, month);

  return (
    <div className={`common-datepicker-wrapper ${className}`} ref={containerRef}>
      {label && <label className="common-datepicker-label">{label}</label>}
      <div className="mx-datepicker w-full relative">
        <div className="mx-input-wrapper" onClick={() => !disabled && setIsOpen(!isOpen)}>
          <input
            name={name}
            type="text"
            autoComplete="off"
            readOnly
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            className="mx-input"
          />
          {clearable && !disabled && (
            <i className="mx-icon-clear" onClick={handleClear} title="Clear date">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em">
                <path
                  fill="currentColor"
                  d="M810.005333 274.005333l-237.994667 237.994667 237.994667 237.994667-60.010667 60.010667-237.994667-237.994667-237.994667 237.994667-60.010667-60.010667 237.994667-237.994667-237.994667-237.994667 60.010667-60.010667 237.994667 237.994667 237.994667-237.994667z"
                />
              </svg>
            </i>
          )}
          <i className="mx-icon-calendar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em">
              <path
                fill="currentColor"
                d="M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0-32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z"
              />
            </svg>
          </i>
        </div>

        {isOpen && (
          <div className={`mx-datepicker-main mx-datepicker-popup ${range ? 'range-popup' : ''}`}>
            {range ? (
              <div className="mx-range-wrapper">
                {renderCalendarTable(leftYear, leftMonth, true)}
                {renderCalendarTable(rightYear, rightMonth, false)}
              </div>
            ) : (
              <div className="mx-datepicker-content">
                <div className="mx-datepicker-body">
                  <div className="mx-calendar mx-calendar-panel-date">
                    <div className="mx-calendar-header">
                      <button type="button" onClick={handlePrevYear} className="mx-btn mx-btn-text mx-btn-icon-double-left">
                        &laquo;
                      </button>
                      {currentView === 'date' && (
                        <button type="button" onClick={handlePrevMonth} className="mx-btn mx-btn-text mx-btn-icon-left">
                          &lsaquo;
                        </button>
                      )}
                      <span className="mx-calendar-header-label">
                        <button
                          type="button"
                          onClick={() => setCurrentView(currentView === 'month' ? 'date' : 'month')}
                          className="mx-btn mx-btn-text font-semibold hover:text-[#1890ff] justify-end"
                        >
                          {monthName}
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentView(currentView === 'year' ? 'date' : 'year')}
                          className="mx-btn mx-btn-text font-semibold hover:text-[#1890ff] justify-start"
                        >
                          {year}
                        </button>
                      </span>
                      {currentView === 'date' && (
                        <button type="button" onClick={handleNextMonth} className="mx-btn mx-btn-text mx-btn-icon-right">
                          &rsaquo;
                        </button>
                      )}
                      <button type="button" onClick={handleNextYear} className="mx-btn mx-btn-text mx-btn-icon-double-right">
                        &raquo;
                      </button>
                    </div>

                    <div className="mx-calendar-content">
                      {currentView === 'month' ? (
                        <table className="mx-table mx-table-month">
                          <tbody>
                            {[0, 1, 2, 3].map((rowIdx) => (
                              <tr key={rowIdx}>
                                {[0, 1, 2].map((colIdx) => {
                                  const mIdx = rowIdx * 3 + colIdx;
                                  const isCurrentViewMonth = mIdx === month;
                                  return (
                                    <td
                                      key={mIdx}
                                      onClick={() => {
                                        setViewDate(new Date(year, mIdx, 1));
                                        setCurrentView('date');
                                      }}
                                      className={`cell ${isCurrentViewMonth ? 'active' : ''}`}
                                    >
                                      {months[mIdx]}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : currentView === 'year' ? (
                        <table className="mx-table mx-table-year">
                          <tbody>
                            {[0, 1, 2, 3].map((rowIdx) => (
                              <tr key={rowIdx}>
                                {[0, 1, 2].map((colIdx) => {
                                  const yIdx = rowIdx * 3 + colIdx;
                                  const y = years[yIdx];
                                  const isCurrentViewYear = y === year;
                                  return (
                                    <td
                                      key={y}
                                      onClick={() => {
                                        setViewDate(new Date(y, month, 1));
                                        setCurrentView('month');
                                      }}
                                      className={`cell ${isCurrentViewYear ? 'active' : ''}`}
                                    >
                                      {y}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="mx-table mx-table-date">
                          <thead>
                            <tr>
                              <th>Su</th>
                              <th>Mo</th>
                              <th>Tu</th>
                              <th>We</th>
                              <th>Th</th>
                              <th>Fr</th>
                              <th>Sa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {singleDays.map((row, rIdx) => (
                              <tr key={rIdx} className="mx-date-row">
                                {row.map((item, cIdx) => {
                                  const active = isSameDay(item.date, parseDateString(value));
                                  const todayCell = isToday(item.date);
                                  return (
                                    <td
                                      key={cIdx}
                                      onClick={() => handleSelectDate(item.date)}
                                      className={`cell ${!item.isCurrentMonth ? 'not-current-month' : ''} ${todayCell ? 'today' : ''} ${active ? 'active' : ''}`}
                                    >
                                      {item.day}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
