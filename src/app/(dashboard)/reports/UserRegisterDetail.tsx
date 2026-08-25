import React, { useCallback, useEffect, useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import TextInput from '@/components/common/TextInput';
import MultiSelect from '@/components/common/MultiSelect';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import { ReportsService } from '@/services/reports.service';

const USER_REGISTER_TYPE_OPTIONS: SelectOption[] = [
  { label: 'All', value: 'all' },
];

const COLUMNS: ColumnDef<any>[] = [
  { key: 'userName', header: 'User Name', width: '140px' },
  { key: 'agentName', header: 'Agent Name', width: '140px' },
  { key: 'mobile', header: 'Mobile', width: '120px' },
  { key: 'createdDate', header: 'Created Date', width: '140px' },
  { key: 'lastLogin', header: 'Last Login', width: '140px' },
  { key: 'firstDepositDate', header: 'First Deposit Date', width: '150px' },
  { key: 'lastDepositDate', header: 'Last Deposit Date', width: '150px' },
  { key: 'deposit', header: 'Deposit', width: '120px', align: 'right' },
  { key: 'sportsBalance', header: 'Sports Balance', width: '130px', align: 'right' },
  { key: 'casinoBalance', header: 'Casino Balance', width: '130px', align: 'right' },
  { key: 'thirdPartyCreditBalance', header: 'Third Party Credit Balance', width: '180px', align: 'right' },
  { key: 'sportBookBalance', header: 'Sport Book Balance', width: '160px', align: 'right' },
];

export default function UserRegisterDetailPage() {
  const [clientSearch, setClientSearch] = useState('');
  const [userRegisterType, setUserRegisterType] = useState('all');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchData = useCallback(async (page: number, limit: number, search: string) => {
    setIsLoading(true);
    const res = await ReportsService.getUserRegisterDetail({ search, page, limit });
    setTableData(res.data);
    setTotalPages(res.totalPages);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData(currentPage, entriesPerPage, tableSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, entriesPerPage]);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(1, entriesPerPage, tableSearch);
  };

  return (
    <div className="report-wrapper user-register-page">
      <div className="report-header-bar">
        <h4 className="report-page-title">User Register Detail</h4>
      </div>

      <div className="report-card">
        <div className="user-register-filter-bar">
          <form onSubmit={handleLoadData} className="flex flex-wrap items-center gap-3">
            <div className="w-[220px]">
              <MultiSelect
                label="Search By Client Name"
                value={clientSearch}
                onChange={setClientSearch}
                options={[]}
                placeholder="Select option"
              />
            </div>
            <div className="w-[220px]">
              <FormSelect
                label="Type"
                value={userRegisterType}
                onChange={setUserRegisterType}
                options={USER_REGISTER_TYPE_OPTIONS}
              />
            </div>
            <button type="submit" className="report-btn-load">
              Load
            </button>
            <button
              type="button"
              onClick={() => {
                setClientSearch('');
                setUserRegisterType('all');
                setTableSearch('');
                setCurrentPage(1);
                fetchData(1, entriesPerPage, '');
              }}
              className="h-[34px] px-3 border border-[#CCCCCC] bg-white hover:bg-[#F5F5F5] text-[#333333] text-xs font-semibold rounded-[3px] transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              title="Export Excel"
              className="btn-export-excel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button
              type="button"
              title="Export PDF"
              className="btn-export-pdf"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>
          </form>
        </div>

        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={tableSearch}
          onSearchChange={setTableSearch}
        />

        <DataTable
          columns={COLUMNS}
          data={tableData}
          isLoading={isLoading}
          emptyMessage="There are no records to show"
          className='assign-agent-table'
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
