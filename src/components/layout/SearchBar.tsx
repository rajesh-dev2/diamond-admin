'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search client username, ID, agent...',
  onSearch,
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    if (onSearch) onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative flex items-center w-full max-w-sm ${className}`}>
      <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C98A1B] focus:border-transparent transition-all dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
