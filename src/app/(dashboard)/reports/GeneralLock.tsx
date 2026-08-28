import React, { useState } from 'react';
import TextInput from '@/components/common/TextInput';
import MultiSelect from '@/components/common/MultiSelect';
import DataTable, { ColumnDef } from '@/components/common/DataTable';

const COLUMNS: ColumnDef<any>[] = [
  { key: 'clientName', header: 'Client Name', width: '200px' },
  { key: 'userLock', header: 'User Lock', width: '120px', align: 'center' },
  { key: 'betLock', header: 'Bet Lock', width: '120px', align: 'center' },
  { key: 'status', header: 'Status', width: '120px', align: 'center' },
  { key: 'action', header: 'Action', width: '140px', align: 'center' },
];

export default function GeneralLockPage() {
  const [clientSearch, setClientSearch] = useState('');
  const [txCode, setTxCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="report-wrapper general-lock-page">
      <div className="report-header-bar mb-0">
        <h4 className="report-page-title">General Lock</h4>
      </div>

      <div className="report-card">
        <div className="user-lock-filter-bar">
          <form onSubmit={handleLoadData} className="ajaxFormSubmit">
            <div className="row row5">
              <div className="col-md-3">
                <MultiSelect
                  value={clientSearch}
                  onChange={setClientSearch}
                  placeholder="Search By Client Name"
                />
              </div>
              <div className="col-md-2">
                <TextInput
                  value={txCode}
                  onChange={setTxCode}
                  placeholder="Transaction Code"
                />
              </div>
              <div className="col-md-2 flex items-center gap-2">
                <button type="submit" className="report-btn-load">
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientSearch('');
                    setTxCode('');
                  }}
                  className="h-[34px] px-3 bg-[#eff2f7] hover:bg-[#e2e6ea] text-[#212529] text-[14px] font-normal rounded-[3px] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          isLoading={isLoading}
          emptyMessage="No data available in table"
          className="user-lock-table"
        />
      </div>
    </div>
  );
}
