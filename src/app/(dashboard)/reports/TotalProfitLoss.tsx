import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DatePicker from '@/components/common/DatePicker';
import MultiSelect from '@/components/common/MultiSelect';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import './styles.css';

const TYPE_OPTIONS: SelectOption[] = [
  { label: 'All', value: '0' },
  { label: 'Sports Report', value: '2' },
  { label: 'Casino Report', value: '3' },
  { label: 'Third Party Casino Report', value: '4' },
];

const SPORTS_REPORT_COLUMNS: ColumnDef<any>[] = [
  { key: 'eventName', header: 'Event Name', align: 'left' },
  { key: 'gameType', header: 'Game Type', align: 'left' },
  { key: 'opening', header: 'Opening', align: 'right' },
  { key: 'closing', header: 'Closing', align: 'right' },
  { key: 'profitLoss', header: 'Profit/Loss', align: 'right' },
];

const CASINO_SUB_COLUMNS: ColumnDef<any>[] = [
  { key: 'casinoName', header: 'Casino Name', align: 'left' },
  { key: 'opening', header: 'Opening', align: 'right' },
  { key: 'closing', header: 'Closing', align: 'right' },
  { key: 'profitLoss', header: 'Profit/Loss', align: 'right' },
];

const THIRD_PARTY_SUB_COLUMNS: ColumnDef<any>[] = [
  { key: 'thirdPartyName', header: 'Third Party Name', align: 'left' },
  { key: 'opening', header: 'Opening', align: 'right' },
  { key: 'closing', header: 'Closing', align: 'right' },
  { key: 'profitLoss', header: 'Profit/Loss', align: 'right' },
];

export default function TotalProfitLossPage() {
  const [clientSearch, setClientSearch] = useState('');
  const [dateRange, setDateRange] = useState('17/08/2026 ~ 27/08/2026');
  const [totalProfitLossType, setTotalProfitLossType] = useState('0');
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
    <div className="report-wrapper total-profit-loss-page p-[10px]">
      <div className="report-header-bar">
        <h4 className="report-page-title">Total Profit Loss</h4>
      </div>

      <div className="report-card p-[1rem]">
        <div className="total-profit-loss-filter-bar">
          <form onSubmit={handleLoadData} className="ajaxFormSubmit">
            <div className="row row5">
              <div className="col-lg-3">
                <MultiSelect
                  label="Search By Client Name"
                  value={clientSearch}
                  onChange={setClientSearch}
                  placeholder="Select option"
                />
              </div>
              <div className="col-lg-3">
                <DatePicker
                  label="Select Date Range"
                  value={dateRange}
                  onChange={setDateRange}
                  range
                />
              </div>
              <div className="col-lg-2">
                <FormSelect
                  label="Type"
                  value={totalProfitLossType}
                  onChange={setTotalProfitLossType}
                  options={TYPE_OPTIONS}
                />
              </div>
            </div>

            <div className="row row5 mt-2">
              <div className="col-12 flex flex-wrap items-center gap-2">
                <button type="submit" className="report-btn-load">
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientSearch('');
                    setTotalProfitLossType('0');
                    setDateRange('17/08/2026 ~ 27/08/2026');
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                </button>
                <button
                  type="button"
                  title="Export PDF"
                  className="btn-export-pdf"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search filter input right-aligned */}
        <div className="flex justify-end my-3">
          <input
            type="search"
            value={tableSearch}
            placeholder="Search..."
            onChange={(e) => setTableSearch(e.target.value)}
            className="common-tablecontrols-input"
          />
        </div>

        <div className="flex flex-col gap-6">
          {/* Section 1: Sports Report */}
          {(totalProfitLossType === '0' || totalProfitLossType === '2') && (
            <div className="report-sub-section">
              <h5 className="report-sub-title">Sports Report</h5>
              <DataTable
                columns={SPORTS_REPORT_COLUMNS}
                data={[]}
                isLoading={isLoading}
                emptyMessage="There are no records to show"
                className="assign-agent-table"
                footer={
                  <tr role="row">
                    <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
                    <th role="columnheader" scope="col" aria-colindex={2}><span></span></th>
                    <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
                    <th role="columnheader" scope="col" aria-colindex={4} className="text-right"><span>0.00</span></th>
                    <th role="columnheader" scope="col" aria-colindex={5} className="text-right"><span>0.00</span></th>
                  </tr>
                }
              />
            </div>
          )}

          {/* Section 2: Casino Report */}
          {(totalProfitLossType === '0' || totalProfitLossType === '3') && (
            <div className="report-sub-section">
              <h5 className="report-sub-title">Casino Report</h5>
              <DataTable
                columns={CASINO_SUB_COLUMNS}
                data={[]}
                isLoading={isLoading}
                emptyMessage="There are no records to show"
                footer={
                  <tr role="row">
                    <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
                    <th role="columnheader" scope="col" aria-colindex={2} className="text-right"><span>0.00</span></th>
                    <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
                    <th role="columnheader" scope="col" aria-colindex={4} className="text-right"><span>0.00</span></th>
                  </tr>
                }
                className="assign-agent-table"
              />
            </div>
          )}

          {/* Section 3: Third Party Report */}
          {(totalProfitLossType === '0' || totalProfitLossType === '4') && (
            <div className="report-sub-section">
              <h5 className="report-sub-title">Third Party Report</h5>
              <DataTable
                columns={THIRD_PARTY_SUB_COLUMNS}
                data={[]}
                isLoading={isLoading}
                emptyMessage="There are no records to show"
                className="assign-agent-table"
                footer={
                  <tr role="row">
                    <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
                    <th role="columnheader" scope="col" aria-colindex={2} className="text-right"><span>0.00</span></th>
                    <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
                    <th role="columnheader" scope="col" aria-colindex={4} className="text-right"><span>0.00</span></th>
                  </tr>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

