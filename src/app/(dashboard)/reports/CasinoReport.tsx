import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import MultiSelect from '@/components/common/MultiSelect';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';

const CASINO_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Select Casino Type', value: '' },
  { label: 'Live Casino', value: 'live' },
  { label: 'Virtual Casino', value: 'virtual' },
];

const CASINO_SELECT_OPTIONS: SelectOption[] = [
  { label: 'Select', value: '' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'gameName', header: 'Game Name', width: '220px' },
  { key: 'type', header: 'Type', width: '140px' },
  { key: 'amount', header: 'Amount', width: '140px', align: 'right' },
  { key: 'total', header: 'Total', width: '140px', align: 'right' },
  { key: 'date', header: 'Date', width: '140px' },
  { key: 'roundId', header: 'Round Id', width: '160px' },
  { key: 'transactionId', header: 'Transaction Id', width: '180px' },
];

export default function CasinoReportPage() {
  const [casinoType, setCasinoType] = useState('');
  const [casinoSearchOption, setCasinoSearchOption] = useState('');
  const [casinoSelect, setCasinoSelect] = useState('');

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
    <div className="report-wrapper casino-report">
      <div className="report-header-bar">
        <h4 className="report-page-title">Casino Report</h4>
      </div>

      <div className="report-card">
        <div className="casino-report-filter-bar">
          <form onSubmit={handleLoadData} className="ajaxFormSubmit">
            <div className="row row5 mb-3">
              <div className="col-xl-2 mb-3">
                <FormSelect
                  value={casinoType}
                  onChange={setCasinoType}
                  options={CASINO_TYPE_OPTIONS}
                />
              </div>
              <div className="form-group col-xl-2">
                <MultiSelect
                  value={casinoSearchOption}
                  onChange={setCasinoSearchOption}
                  placeholder="Select option"
                />
              </div>
              <div className="col-xl-2 mb-3">
                <FormSelect
                  value={casinoSelect}
                  onChange={setCasinoSelect}
                  options={CASINO_SELECT_OPTIONS}
                />
              </div>
              <div className="col-xl mb-3">
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
          className="statement-table"
          footer={
            <tr role="row">
              <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={2}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
              <th role="columnheader" scope="col" aria-colindex={4} className="text-right"><span>0.00</span></th>
              <th role="columnheader" scope="col" aria-colindex={5}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={6}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={7}><span></span></th>
            </tr>
          }
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
