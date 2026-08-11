import React, { useState } from 'react';
import TextInput from '@/components/common/TextInput';
import MultiSelect from '@/components/common/MultiSelect';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';

const COLUMNS: ColumnDef<any>[] = [
  { key: 'no', header: 'No', width: '80px' },
  { key: 'userName', header: 'User Name', width: '220px' },
  { key: 'casino', header: 'Casino', width: '140px', align: 'right' },
  { key: 'sport', header: 'Sport', width: '140px', align: 'right' },
  { key: 'thirdParty', header: 'Third Party', width: '150px', align: 'right' },
  { key: 'profitLoss', header: 'Profit/Loss', width: '150px', align: 'right' },
];

export default function UserWinLossPage() {
  const [clientSearch, setClientSearch] = useState('');
  const [dateRange, setDateRange] = useState('30/07/2026 - 09/08/2026');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="report-wrapper">
      <div className="report-header-bar">
        <h4 className="report-page-title">User Win Loss</h4>
      </div>

      <div className="report-card">
        <div className="user-win-loss-filter-bar">
          <form onSubmit={handleLoadData} className="flex flex-wrap items-end gap-3">
            <div className="w-[220px]">
              <MultiSelect
                label="Search By Client Name"
                value={clientSearch}
                onChange={setClientSearch}
                placeholder="Select option"
              />
            </div>
            <div className="w-[240px]">
              <TextInput
                label="Select Date Range"
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            <button type="submit" className="report-btn-load">
              Load
            </button>
            <button
              type="button"
              onClick={() => {
                setClientSearch('');
                setDateRange('30/07/2026 - 09/08/2026');
              }}
              className="h-[34px] px-3 border border-[#CCCCCC] bg-white hover:bg-[#F5F5F5] text-[#333333] text-xs font-semibold rounded-[3px] transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              title="Export Excel"
              className="btn-export-excel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              type="button"
              title="Export PDF"
              className="btn-export-pdf"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </form>
        </div>

        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={tableSearch}
          onSearchChange={setTableSearch}
          showEntriesSelect={false}
        />

        <div>
          <DataTable
            columns={COLUMNS}
            data={[]}
            isLoading={isLoading}
            emptyMessage="There are no records to show"
          />
          <div className="flex justify-end items-center gap-12 py-2 px-6 text-[13px] font-bold text-[#333333] border-t border-[#E0E0E0]">
            <span>0.00</span>
            <span>0.00</span>
            <span>0.00</span>
            <span>0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
