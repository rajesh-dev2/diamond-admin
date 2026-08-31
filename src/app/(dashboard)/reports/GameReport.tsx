import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DatePicker from '@/components/common/DatePicker';
import DataTable, { ColumnDef } from '@/components/common/DataTable';

const GAME_REPORT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Match', value: 'match' },
  { label: 'Fancy', value: 'fancy' },
];

const GAME_REPORT_SUB_OPTIONS: SelectOption[] = [
  { label: 'All', value: 'all' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '565px' },
  { key: 'name', header: 'Name', width: '591px' },
  { key: 'amount', header: 'Amount', width: '712px', align: 'left' },
];

export default function GameReportPage() {
  const [fromDate, setFromDate] = useState('18/08/2026');
  const [toDate, setToDate] = useState('25/08/2026');
  const [gameReportType, setGameReportType] = useState('all');
  const [gameReportSubSelect, setGameReportSubSelect] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="report-wrapper p-2.5">
      <div className="report-header-bar">
        <h4 className="report-page-title">Game Report</h4>
      </div>

      <div className="report-card">
        <div className="game-report-filter-bar">
          <div className="row mt-3">
            <div className="col-12">
              <form method="post" data-vv-scope="toReport" className="ajaxFormSubmit" onSubmit={(e) => e.preventDefault()}>
                <div className="row mb-3">
                  <div className="col-md-2">
                    <DatePicker
                      label="From"
                      value={fromDate}
                      onChange={setFromDate}
                    />
                  </div>
                  <div className="col-md-2">
                    <DatePicker
                      label="To"
                      value={toDate}
                      onChange={setToDate}
                    />
                  </div>
                  <div className="col-md-4 col-xl-2">
                    <FormSelect
                      label="Type"
                      value={gameReportType}
                      onChange={setGameReportType}
                      options={GAME_REPORT_TYPE_OPTIONS}
                    />
                  </div>
                  <div className="col-md-4 col-xl-3 mt-4">
                    <button type="button" className="report-btn-load normal-case font-normal text-[14px] px-3">
                      Game List
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <form method="post" data-vv-scope="gamereport" className="ajaxFormSubmit" onSubmit={handleLoadData}>
                <div className="row">
                  <div className="col-md-8 col-xl-6">
                    <FormSelect
                      value={gameReportSubSelect}
                      onChange={setGameReportSubSelect}
                      options={GAME_REPORT_SUB_OPTIONS}
                    />
                  </div>
                  <div className="col-md-4 col-xl-3 flex items-center gap-2">
                    <button type="submit" className="report-btn-load normal-case font-normal text-[14px] px-3">
                      Show Game Report
                    </button>
                    <button type="button" className="report-btn-load normal-case font-normal text-[14px] px-3">
                      Master Game Report
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <DataTable
          columns={COLUMNS}
          data={[]}
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
