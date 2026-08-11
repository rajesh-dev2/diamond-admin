import React from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface ReportFormSelectProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  options: SelectOption[];
  className?: string;
  id?: string;
}

export const ReportFormSelect: React.FC<ReportFormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  className = '',
  id,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label htmlFor={id} className="report-label">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="report-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReportFormSelect;
