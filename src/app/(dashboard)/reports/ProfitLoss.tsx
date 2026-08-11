import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';

const PROFIT_LOSS_SELECT_OPTIONS: SelectOption[] = [
  { label: 'All', value: 'all' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'no', header: 'No', width: '80px' },
  { key: 'userName', header: 'User Name', width: '180px' },
  { key: 'level', header: 'Level', width: '120px' },
  { key: 'casinoPts', header: 'Casino Pts', width: '150px', align: 'right' },
  { key: 'sportPts', header: 'Sport Pts', width: '150px', align: 'right' },
  { key: 'thirdPartyPts', header: 'Third Party Pts', width: '160px', align: 'right' },
  { key: 'profitLoss', header: 'Profit/Loss', width: '150px', align: 'right' },
];

export default function ProfitLossPage() {
  const [profitLossSelect, setProfitLossSelect] = useState('all');

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
        <h4 className="report-page-title">Profit Loss</h4>
      </div>

      <div className="report-card">
        <div className="profit-loss-filter-bar">
          <form onSubmit={handleLoadData} className="flex items-end gap-3">
            <div className="w-[250px]">
              <FormSelect
                value={profitLossSelect}
                onChange={setProfitLossSelect}
                options={PROFIT_LOSS_SELECT_OPTIONS}
              />
            </div>
            <button type="submit" className="report-btn-load">
              Load
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
