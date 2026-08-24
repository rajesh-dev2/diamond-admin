import React, { useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DatePicker from '@/components/common/DatePicker';
import DataTable, { ColumnDef } from '@/components/common/DataTable';

const GAME_REPORT_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Match', value: 'match' },
  { label: 'Fancy', value: 'fancy' },
];

const GAME_REPORT_SUB_OPTIONS: SelectOption[] = [
  { label: 'All', value: 'all' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '100px' },
  { key: 'name', header: 'Name', width: '350px' },
  { key: 'amount', header: 'Amount', width: '150px', align: 'right' },
];

export default function GameReportPage() {
  const [fromDate, setFromDate] = useState('02/08/2026');
  const [toDate, setToDate] = useState('09/08/2026');
  const [gameReportType, setGameReportType] = useState('match');
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
    <div className="report-wrapper">
      <div className="report-header-bar">
        <h4 className="report-page-title">Game Report</h4>
      </div>

      <div className="report-card">
        <div className="game-report-filter-bar">
          <form onSubmit={handleLoadData} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-[220px]">
                <DatePicker
                  label="From"
                  value={fromDate}
                  onChange={setFromDate}
                />
              </div>
              <div className="w-[220px]">
                <DatePicker
                  label="To"
                  value={toDate}
                  onChange={setToDate}
                />
              </div>
              <div className="w-[220px]">
                <FormSelect
                  label="Type"
                  value={gameReportType}
                  onChange={setGameReportType}
                  options={GAME_REPORT_TYPE_OPTIONS}
                />
              </div>
              <button type="button" className="report-btn-load">
                Game List
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[455px]">
                <FormSelect
                  value={gameReportSubSelect}
                  onChange={setGameReportSubSelect}
                  options={GAME_REPORT_SUB_OPTIONS}
                />
              </div>
              <button type="submit" className="report-btn-load">
                Show Game Report
              </button>
              <button type="button" className="report-btn-load">
                Master Game Report
              </button>
            </div>
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
