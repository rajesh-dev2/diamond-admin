import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import { ReportsService } from '@/services/reports.service';

const GENERAL_REPORT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Credit Reference Report', value: 'credit-reference' },
  { label: 'General Report', value: 'general' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '100px' },
  { key: 'name', header: 'Name', width: '350px' },
  { key: 'amount', header: 'Amount', width: '150px', align: 'right' },
];

export default function GeneralReportPage() {
  const [generalReportType, setGeneralReportType] = useState('credit-reference');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    ReportsService.getGeneralReport({
      type: generalReportType,
      search: '',
    })
      .then(setReportData)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="report-wrapper p-2.5">
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
          data={reportData}
          isLoading={isLoading}
          emptyMessage="No data available in table"
          className='general-report-table'
        />
      </div>
    </div>
  );
}
