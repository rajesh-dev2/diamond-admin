import React, { useState, useRef, useEffect } from 'react';
import './style.css';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options?: MultiSelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  id,
  name,
  disabled = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes((value || '').toLowerCase())
  );

  const handleSelect = (opt: MultiSelectOption) => {
    onChange(opt.label);
    setIsOpen(false);
  };

  return (
    <div className={`common-multiselect-wrapper ${className}`}>
      {label && (
        <label htmlFor={id} className="common-multiselect-label">
          {label}
        </label>
      )}
      <div
        tabIndex={-1}
        role="combobox"
        aria-owns="listbox-null"
        className={`multiselect ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        ref={containerRef}
      >
        {icon && (
          <div className="multiselect__select h-full">
            {icon}
          </div>
        )}

        <div
          className={`multiselect__tags ${icon ? 'pr-8' : 'pr-2.5'}`}
          onClick={() => !disabled && setIsOpen(true)}
        >
          <div className="multiselect__tags-wrap" style={{ display: 'none' }}></div>
          <div className="multiselect__spinner" style={{ display: 'none' }}></div>

          <input
            id={id}
            name={name}
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            tabIndex={0}
            aria-controls="listbox-null"
            value={value}
            disabled={disabled}
            onFocus={() => !disabled && setIsOpen(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            className="multiselect__input"
            style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
          />
        </div>

        {isOpen && (
          <div
            tabIndex={-1}
            className="multiselect__content-wrapper"
            style={{ maxHeight: '300px', display: 'block' }}
          >
            <ul
              role="listbox"
              id="listbox-null"
              className="multiselect__content"
              style={{ display: 'block' }}
            >
              <li style={{ display: 'none' }}>
                <span className="multiselect__option">
                  <span>No elements found</span>
                </span>
              </li>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <li key={idx} onClick={() => handleSelect(opt)}>
                    <span className="multiselect__option">{opt.label}</span>
                  </li>
                ))
              ) : (
                <li>
                  <span className="multiselect__option">List is empty.</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
