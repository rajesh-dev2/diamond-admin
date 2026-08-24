import React, { useEffect, useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import DatePicker from '@/components/common/DatePicker';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import { ReportsService } from '@/services/reports.service';

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
  const [levelOptions, setLevelOptions] = useState<SelectOption[]>([]);
  const [profitLossSelect, setProfitLossSelect] = useState('all');
  const [fromDate, setFromDate] = useState('02/08/2026');
  const [toDate, setToDate] = useState('09/08/2026');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    ReportsService.getProfitLossLevels().then((options) => {
      setLevelOptions(options);
      if (options.length > 0) {
        setProfitLossSelect(String(options[0].value));
      }
    });
  }, []);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    ReportsService.getProfitLoss({
      level: profitLossSelect,
      search: tableSearch,
      from: fromDate,
      to: toDate,
    })
      .then(setReportData)
      .finally(() => setIsLoading(false));
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
                options={levelOptions}
              />
            </div>

            <div className="w-[220px]">
              <DatePicker label="From" value={fromDate} onChange={setFromDate} />
            </div>

            <div className="w-[220px]">
              <DatePicker label="To" value={toDate} onChange={setToDate} />
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
          data={reportData}
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
