import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DataTable, { ColumnDef } from '@/components/common/DataTable';

const GENERAL_REPORT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'General Report', value: 'general' },
  { label: 'Deposit/Withdraw Report', value: 'deposit_withdraw' },
  { label: 'Sports Report', value: 'sports' },
  { label: 'Casino Report', value: 'casino' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '100px' },
  { key: 'name', header: 'Name', width: '350px' },
  { key: 'amount', header: 'Amount', width: '150px', align: 'right' },
];

export default function GeneralReportPage() {
  const [generalReportType, setGeneralReportType] = useState('general');
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
        <h4 className="report-page-title">General Report</h4>
      </div>

      <div className="report-card">
        <div className="general-report-filter-bar">
          <form onSubmit={handleLoadData} className="flex items-end gap-3">
            <div className="w-[220px]">
              <FormSelect
                label="Select Type"
                value={generalReportType}
                onChange={setGeneralReportType}
                options={GENERAL_REPORT_TYPE_OPTIONS}
              />
            </div>
            <button type="submit" className="report-btn-load">
              Load
            </button>
          </form>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
          isLoading={isLoading}
          emptyMessage="No data available in table"
        />
      </div>
    </div>
  );
}
