import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import TableControls from '@/components/common/TableControls';
import Pagination from '@/components/common/Pagination';
import './style.css';

const COLUMNS: ColumnDef<any>[] = [
  { key: 'userName', header: 'User Name', width: '160px' },
  { key: 'creditReference', header: 'Credit Referance', width: '160px', align: 'right' },
  { key: 'uSt', header: 'U st', width: '80px', align: 'center' },
  { key: 'bSt', header: 'B st', width: '80px', align: 'center' },
  { key: 'exposureLimit', header: 'Exposure Limit', width: '140px', align: 'right' },
  { key: 'defaultPct', header: 'Deafult (%)', width: '120px', align: 'center' },
  { key: 'accountType', header: 'Account Type', width: '140px', align: 'center' },
  { key: 'action', header: 'Action', width: '100px', align: 'center' },
];

export default function ClientsPage() {
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleReset = () => {
    setSearchTerm('');
    setTableData([]);
  };

  return (
    <div className="client-list-wrapper">
      {/* Title & Top Action Button */}
      <div className="client-list-header">
        <h4 className="client-list-title">Account List</h4>
        <button
          type="button"
          className="btn-add-account"
          onClick={() => navigate(ROUTES.INSERT_USER)}
        >
          Add Account
        </button>
      </div>

      <div className="client-list-card">
        {/* PDF & Excel Action Buttons */}
        <div className="client-list-actions-bar">
          <button type="button" className="btn-export-pdf">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            PDF
          </button>
          <button type="button" className="btn-export-excel">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Excel
          </button>
        </div>

        {/* Controls Bar */}
        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          extraActions={
            <div className="client-list-action-btns">
              <button type="button" onClick={handleLoad} className="btn-load-data">
                Load
              </button>
              <button type="button" onClick={handleReset} className="btn-reset-data">
                Reset
              </button>
            </div>
          }
        />

        {/* Data Table */}
        <DataTable
          columns={COLUMNS}
          data={tableData}
          isLoading={isLoading}
          emptyMessage="There are no records to show"
        />

        {/* Pagination */}
        <div className="client-list-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            totalItems={tableData.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
