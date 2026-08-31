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
  { key: 'userName', header: 'User Name', width: '128px' },
  { key: 'agentName', header: 'Agent Name', width: '130px' },
  { key: 'mobile', header: 'Mobile', width: '95px' },
  { key: 'createdDate', header: 'Created Date', width: '143px' },
  { key: 'lastLogin', header: 'Last Login', width: '124px' },
  { key: 'firstDepositDate', header: 'First Deposit Date', width: '181px' },
  { key: 'lastDepositDate', header: 'Last Deposit Date', width: '180px' },
  { key: 'deposit', header: 'Deposit', width: '100px', align: 'right' },
  { key: 'sportsBalance', header: 'Sports Balance', width: '160px', align: 'right' },
  { key: 'casinoBalance', header: 'Casino Balance', width: '162px', align: 'right' },
  { key: 'thirdPartyCreditBalance', header: 'Third Party Credit Balance', width: '244px', align: 'right' },
  { key: 'sportBookBalance', header: 'Sport Book Balance', width: '194px', align: 'right' },
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

      <div className="report-card p-[17px] pt-0">
        <div className="user-register-filter-bar mb-4">
          <form onSubmit={handleLoadData} className="ajaxFormSubmit">
            <div className="row row5 align-items-end">
              <div className="col-2">
                <MultiSelect
                  label="Search By Client Name"
                  value={clientSearch}
                  onChange={setClientSearch}
                  options={[]}
                  placeholder="Select option"
                />
              </div>
              <div className="col-2">
                <FormSelect
                  label="Type"
                  value={userRegisterType}
                  onChange={setUserRegisterType}
                  options={USER_REGISTER_TYPE_OPTIONS}
                />
              </div>
              <div className="col-3 flex items-center gap-1.5">
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
                  className="h-[34px] px-3.5 bg-[#eff2f7] hover:bg-[#e2e6ea] text-[#212529] text-[14px] font-normal rounded-[3px] transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  title="Export Excel"
                  className="btn-export-excel btn"
                  disabled
                >
                  <i className="fas fa-file-excel text-[14px]"></i>
                </button>
                <button
                  type="button"
                  title="Export PDF"
                  disabled
                  className="btn-export-pdf"
                >
                  <i className="fas fa-file-pdf text-[14px]"></i>
                </button>
              </div>
            </div>
          </form>
        </div>

        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={tableSearch}
          onSearchChange={setTableSearch}
          className='mb-0'
        />

        <DataTable
          columns={COLUMNS}
          data={tableData}
          isLoading={isLoading}
          emptyMessage="There are no records to show"
          className="user-register-table"
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
