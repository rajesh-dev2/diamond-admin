import React from 'react';

export interface ReportSearchInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const ReportSearchInput: React.FC<ReportSearchInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="report-label">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="report-input"
      />
    </div>
  );
};

export default ReportSearchInput;
