import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import TextInput from '@/components/common/TextInput';
import MultiSelect from '@/components/common/MultiSelect';
import DatePicker from '@/components/common/DatePicker';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';

const ACCOUNT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'All', value: '0' },
  { label: 'Deposit/Withdraw Report', value: '1' },
  { label: 'Sports Report', value: '2' },
  { label: 'Casino Report', value: '3' },
  { label: 'Third Party Casino Report', value: '4' },
];

const GAME_NAME_OPTIONS: SelectOption[] = [
  { label: 'All', value: 'allbalance' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'date', header: 'Date', width: '120px' },
  { key: 'credit', header: 'Credit', width: '120px', align: 'right' },
  { key: 'debit', header: 'Debit', width: '120px', align: 'right' },
  { key: 'closing', header: 'Closing', width: '120px', align: 'right' },
  { key: 'description', header: 'Description', width: '350px' },
  { key: 'fromto', header: 'Fromto', width: '120px' },
];

export default function AccountStatementPage() {
  const [accountType, setAccountType] = useState('0');
  const [gameName, setGameName] = useState('allbalance');
  const [clientSearch, setClientSearch] = useState('');
  const [fromDate, setFromDate] = useState('02/08/2026');
  const [toDate, setToDate] = useState('09/08/2026');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
        <h4 className="report-page-title">Account Statement</h4>
      </div>

      <div className="report-card">
        <div className="mb-4 pb-3 border-b border-[#F0F0F0]">
          <form onSubmit={handleLoadData}>
            <div className="report-form-fields">
              <FormSelect
                className="report-filter-select"
                label="Account Type"
                value={accountType}
                onChange={setAccountType}
                options={ACCOUNT_TYPE_OPTIONS}
              />

              <FormSelect
                className="report-filter-select"
                label="Game Name"
                value={gameName}
                onChange={setGameName}
                options={GAME_NAME_OPTIONS}
              />

              <MultiSelect
                label="Search By Client Name"
                value={clientSearch}
                onChange={setClientSearch}
                placeholder="Select option"
              />

              <DatePicker
                className="report-filter-datepicker"
                label="From"
                value={fromDate}
                onChange={setFromDate}
              />

              <DatePicker
                className="report-filter-datepicker"
                label="To"
                value={toDate}
                onChange={setToDate}
              />
            </div>

            <div className="report-form-actions mt-3">
              <button type="submit" className="report-btn-load">
                Load
              </button>
            </div>
          </form>
        </div>

        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={tableSearch}
          onSearchChange={setTableSearch}
        />

        <DataTable
          columns={COLUMNS}
          data={[]}
          isLoading={isLoading}
          emptyMessage="No data available in table"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
