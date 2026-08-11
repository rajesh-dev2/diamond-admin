import React from 'react';
import './style.css';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormSelectProps {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = '',
  id,
  name,
}) => {
  return (
    <div className={`common-form-select-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="common-form-select-label">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="common-form-select-input"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
