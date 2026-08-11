import React from 'react';
import './style.css';

export interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'search' | 'password' | 'email' | 'number';
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
  id,
  name,
}) => {
  return (
    <div className={`common-textinput-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="common-textinput-label">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="common-textinput-input"
      />
    </div>
  );
};

export default TextInput;
