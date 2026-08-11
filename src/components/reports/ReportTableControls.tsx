import React from 'react';

export interface ReportTableControlsProps {
  entriesPerPage: number;
  onEntriesChange: (val: number) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const ReportTableControls: React.FC<ReportTableControlsProps> = ({
  entriesPerPage,
  onEntriesChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="report-controls-bar">
      <div>
        <label className="inline-flex items-center">
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => onEntriesChange(Number(e.target.value))}
            className="report-entries-select"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
            <option value={125}>125</option>
            <option value={150}>150</option>
          </select>
          entries
        </label>
      </div>

      <div>
        <label className="inline-flex items-center font-medium">
          Search:
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="report-search-field"
          />
        </label>
      </div>
    </div>
  );
};

export default ReportTableControls;
