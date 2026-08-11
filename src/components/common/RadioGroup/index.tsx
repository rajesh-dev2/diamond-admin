import React from 'react';
import './style.css';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`common-radiogroup-wrapper ${className}`}>
      {options.map((opt) => {
        const isChecked = opt.value === value;
        return (
          <label
            key={opt.value}
            className={`common-radiogroup-label ${
              disabled ? 'common-radiogroup-label-disabled' : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isChecked}
              disabled={disabled}
              onChange={() => onChange(opt.value)}
              className="common-radiogroup-input"
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
