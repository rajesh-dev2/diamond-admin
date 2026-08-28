import React, { useState } from 'react';
import DatePicker from '@/components/common/DatePicker';
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
    <div className="report-wrapper user-register-page">
      <div className="report-header-bar">
        <h4 className="report-page-title">User Win Loss</h4>
      </div>

      <div className="report-card">
        <div className="user-win-loss-filter-bar">
          <div className="report-form mb-3">
            <form onSubmit={handleLoadData} className="ajaxFormSubmit">
              <div className="row row5 align-items-end">
                <div className="col-2">
                  <MultiSelect
                    label="Search By Client Name"
                    value={clientSearch}
                    onChange={setClientSearch}
                    placeholder="Select option"
                  />
                </div>
                <div className="col-3">
                  <DatePicker
                    label="Select Date Range"
                    value={dateRange}
                    onChange={setDateRange}
                    range
                  />
                </div>
                <div className="col-3 flex items-center gap-1.5">
                  <button type="submit" className="report-btn-load">
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClientSearch('');
                      setDateRange('30/07/2026 - 09/08/2026');
                    }}
                    className="h-[34px] px-3.5 bg-[#eff2f7] hover:bg-[#e2e6ea] text-[#212529] text-[14px] font-normal rounded-[3px] transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    title="Export Excel"
                    className="btn-export-excel"
                  >
                    <i className="fas fa-file-excel text-[14px]"></i>
                  </button>
                  <button
                    type="button"
                    title="Export PDF"
                    className="btn-export-pdf"
                  >
                    <i className="fas fa-file-pdf text-[14px]"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
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
            className="user-win-loss-table"
            footer={
              <tr role="row">
                <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
                <th role="columnheader" scope="col" aria-colindex={2}><span></span></th>
                <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
                <th role="columnheader" scope="col" aria-colindex={4} className="text-right"><span>0.00</span></th>
                <th role="columnheader" scope="col" aria-colindex={5} className="text-right"><span>0.00</span></th>
                <th role="columnheader" scope="col" aria-colindex={6} className="text-right"><span>0.00</span></th>
              </tr>
            }
          />
        </div>
      </div>
    </div>
  );
}
