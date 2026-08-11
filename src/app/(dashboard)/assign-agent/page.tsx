import React, { useState } from 'react';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import TableControls from '@/components/common/TableControls';
import DatePicker from '@/components/common/DatePicker';
import './style.css';

const COLUMNS: ColumnDef<any>[] = [
  { key: 'sNo', header: 'S.No.', width: '80px', align: 'center' },
  { key: 'userName', header: 'User Name', width: '180px' },
  { key: 'assignAgentSettings', header: 'Assign Agent Settings', width: '220px' },
  { key: 'mobileNumber', header: 'Mobile Number', width: '160px' },
  { key: 'depoMobileNumber', header: 'Depo Mobile Number', width: '180px' },
  { key: 'firstBonusStatus', header: 'First Bonus Status', width: '160px' },
];

export default function AssignAgentPage() {
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('03/08/2026');
  const [toDate, setToDate] = useState('10/08/2026');
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  const handleDownloadCSV = () => {
    // CSV download trigger placeholder
  };

  return (
    <div className="assign-agent-wrapper">
      {/* Title */}
      <h4 className="assign-agent-title">Assign Agent List</h4>

      <div className="assign-agent-card">
        {/* Controls Bar */}
        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          className="mb-3"
        />

        {/* Data Table */}
        <DataTable
          columns={COLUMNS}
          data={tableData}
          isLoading={isLoading}
          emptyMessage="There are no records to show"
        />
      </div>

      {/* User Creation Section */}
      <h4 className="user-creation-title">User Creation</h4>

      <div className="user-creation-card">
        <div className="user-creation-filter-row">
          <div className="user-creation-date-field">
            <DatePicker
              label="From Date:"
              value={fromDate}
              onChange={setFromDate}
            />
          </div>
          <div className="user-creation-date-field">
            <DatePicker
              label="To Date:"
              value={toDate}
              onChange={setToDate}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="btn-download-csv"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
