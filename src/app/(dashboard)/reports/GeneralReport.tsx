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
          <form onSubmit={handleLoadData} className="ajaxFormSubmit">
            <div className="row row5">
              <div className="col-md-4 col-xl-2">
                <FormSelect
                  label="Select Type"
                  value={generalReportType}
                  onChange={setGeneralReportType}
                  options={GENERAL_REPORT_TYPE_OPTIONS}
                />
              </div>

              <div className="col-md-4 col-xl-3 mt-4">
                <button type="submit" className="report-btn-load">
                  Load
                </button>
              </div>
            </div>
          </form>
        </div>

        <DataTable
          columns={COLUMNS}
          data={reportData}
          isLoading={isLoading}
          emptyMessage="No data available in table"
          className="general-report-table"
          footer={
            <tr role="row">
              <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={2}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
            </tr>
          }
        />
      </div>
    </div>
  );
}
