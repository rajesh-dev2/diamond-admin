import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DatePicker from '@/components/common/DatePicker';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';

const CASINO_RESULT_SELECT_OPTIONS: SelectOption[] = [
  { label: 'Select Game', value: '' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'marketId', header: 'Market Id', width: '350px' },
  { key: 'winner', header: 'Winner', width: 'auto' },
];

export default function CasinoResultPage() {
  const [casinoResultDate, setCasinoResultDate] = useState('09/08/2026');
  const [casinoResultGame, setCasinoResultGame] = useState('');

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
    <div className="report-wrapper casino-result-page">
      <div className="report-header-bar">
        <h4 className="report-page-title">Casino Result Report</h4>
      </div>

      <div className="report-card">
        <div className="casino-result-filter-bar">
          <form onSubmit={handleLoadData} className="ajaxFormSubmit">
            <div className="row row5">
              <div className="col-2 mb-2">
                <DatePicker
                  value={casinoResultDate}
                  onChange={setCasinoResultDate}
                />
              </div>
              <div className="col-2 mb-2">
                <FormSelect
                  value={casinoResultGame}
                  onChange={setCasinoResultGame}
                  options={CASINO_RESULT_SELECT_OPTIONS}
                />
              </div>
              <div className="col-6 mb-2">
                <button type="submit" className="report-btn-load">
                  Submit
                </button>
              </div>
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
          className='general-report-table'
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
