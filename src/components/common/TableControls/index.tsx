import React from 'react';
import './style.css';

export interface TableControlsProps {
  entriesPerPage: number;
  onEntriesChange: (entries: number) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  showEntriesSelect?: boolean;
  className?: string;
  extraActions?: React.ReactNode;
  placeholder?: string;
}

export const TableControls: React.FC<TableControlsProps> = ({
  entriesPerPage,
  onEntriesChange,
  searchTerm,
  onSearchChange,
  showEntriesSelect = true,
  className = '',
  extraActions,
  placeholder = 'Search...',
}) => {
  return (
    <div className={`common-tablecontrols-wrapper ${className}`}>
      {/* Left side: Show entries */}
      <div className="common-tablecontrols-left">
        {showEntriesSelect && (
          <div className="common-tablecontrols-label">
            Show{' '}
            <select
              value={entriesPerPage}
              onChange={(e) => onEntriesChange(Number(e.target.value))}
              className="common-tablecontrols-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>{' '}
            entries
          </div>
        )}
      </div>

      {/* Right side: Search + Extra Actions */}
      <div className="common-tablecontrols-right">
        <div className="common-tablecontrols-label">
          Search:{' '}
          <input
            type="search"
            value={searchTerm}
            placeholder={placeholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="common-tablecontrols-input"
          />
        </div>
        {extraActions}
      </div>
    </div>
  );
};

export default TableControls;
