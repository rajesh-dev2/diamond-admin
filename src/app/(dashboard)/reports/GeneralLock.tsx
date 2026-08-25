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
      <div className="report-header-bar">
        <h4 className="report-page-title">General Lock</h4>
      </div>

      <div className="report-card">
        <div className="user-lock-filter-bar">
          <form onSubmit={handleLoadData} className="flex flex-wrap items-center gap-3">
            <div className="w-[331px]">
              <MultiSelect
                value={clientSearch}
                onChange={setClientSearch}
                placeholder="Search By Client Name"
              />
            </div>
            <div className="w-[220px]">
              <TextInput
                value={txCode}
                onChange={setTxCode}
                placeholder="Transaction Code"
              />
            </div>
            <button type="submit" className="report-btn-load">
              Load
            </button>
            <button
              type="button"
              onClick={() => {
                setClientSearch('');
                setTxCode('');
              }}
              className="h-[34px] px-3 ml-[-6px] bg-[#eff2f7] text-[#212529] text-[14px] font-normal rounded-[3px] transition-colors"
            >
              Reset
            </button>
          </form>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          isLoading={isLoading}
          emptyMessage="No data available in table"
          className='general-report-table'
        />
      </div>
    </div>
  );
}
