import React, { useState, useRef, useEffect } from 'react';

export interface ReportDatePickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export const ReportDatePicker: React.FC<ReportDatePickerProps> = ({
  label,
  value,
  onChange,
  className = '',
  placeholder = 'DD/MM/YYYY',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default to current date (Aug 2026) for calendar view
  const [viewDate, setViewDate] = useState(() => new Date(2026, 7, 2));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const year = viewDate.getFullYear();
    const formatted = `${d}/${month}/${year}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Generate calendar days for current view month
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'short' });

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: { day: number; currentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, currentMonth: true });
  }

  // Extract selected day if value matches current view month/year
  let selectedDay: number | null = null;
  if (value) {
    const parts = value.split('/');
    if (parts.length === 3) {
      const parsedD = parseInt(parts[0], 10);
      const parsedM = parseInt(parts[1], 10) - 1;
      const parsedY = parseInt(parts[2], 10);
      if (parsedM === month && parsedY === year) {
        selectedDay = parsedD;
      }
    }
  }

  return (
    <div className={`flex flex-col report-datepicker-wrapper ${className}`} ref={containerRef}>
      {label && <label className="report-label">{label}</label>}
      <div className="relative mx-input-wrapper">
        <input
          type="text"
          readOnly
          value={value}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className="report-datepicker-input"
        />
        <i className="mx-icon-clear" onClick={handleClear} title="Clear date">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em">
            <path
              fill="currentColor"
              d="M810.005333 274.005333l-237.994667 237.994667 237.994667 237.994667-60.010667 60.010667-237.994667-237.994667-237.994667 237.994667-60.010667-60.010667 237.994667-237.994667-237.994667-237.994667 60.010667-60.010667 237.994667 237.994667 237.994667-237.994667z"
            />
          </svg>
        </i>
        <i className="mx-icon-calendar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em">
            <path
              fill="currentColor"
              d="M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0-32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z"
            />
          </svg>
        </i>

        {isOpen && (
          <div className="report-calendar-popup">
            <div className="report-calendar-header">
              <span className="report-calendar-nav" onClick={handlePrevMonth}>
                &lt;&lt; &lt;
              </span>
              <span>
                {monthName} {year}
              </span>
              <span className="report-calendar-nav" onClick={handleNextMonth}>
                &gt; &gt;&gt;
              </span>
            </div>

            <div className="report-calendar-grid">
              <div className="report-calendar-day-head">Su</div>
              <div className="report-calendar-day-head">Mo</div>
              <div className="report-calendar-day-head">Tu</div>
              <div className="report-calendar-day-head">We</div>
              <div className="report-calendar-day-head">Th</div>
              <div className="report-calendar-day-head">Fr</div>
              <div className="report-calendar-day-head">Sa</div>

              {days.map((item, idx) => {
                const isSelected = item.currentMonth && item.day === selectedDay;
                return (
                  <div
                    key={idx}
                    onClick={() => item.currentMonth && handleSelectDay(item.day)}
                    className={`report-calendar-day ${
                      !item.currentMonth ? 'outside' : ''
                    } ${isSelected ? 'selected' : ''}`}
                  >
                    {item.day}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDatePicker;
