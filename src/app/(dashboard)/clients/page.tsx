import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import TableControls from '@/components/common/TableControls';
import Pagination from '@/components/common/Pagination';
import { AccountService, AccountListItem } from '@/services/account.service';
import { ROLE_HIERARCHY } from '@/constants/roles';
import AccountTransactionModal, { TransactionType } from '@/components/account/AccountTransactionModal';
import ExposureLimitModal from '@/components/account/ExposureLimitModal';
import CreditModal from '@/components/account/CreditModal';
import PasswordModal from '@/components/account/PasswordModal';
import ChangeStatusModal from '@/components/account/ChangeStatusModal';
import './style.css';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { id: parentId } = useParams<{ id: string }>();
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<AccountListItem[]>([]);
  const [txnModal, setTxnModal] = useState<{ account: AccountListItem; type: TransactionType } | null>(null);
  const [exposureLimitAccount, setExposureLimitAccount] = useState<AccountListItem | null>(null);
  const [creditAccount, setCreditAccount] = useState<AccountListItem | null>(null);
  const [passwordAccount, setPasswordAccount] = useState<AccountListItem | null>(null);
  const [statusAccount, setStatusAccount] = useState<AccountListItem | null>(null);

  const fetchAccounts = useCallback(
    async (page: number, limit: number, search: string) => {
      setIsLoading(true);
      try {
        const res = parentId
          ? await AccountService.getDownline(parentId, { search, accountType: '', isActive: '', page, limit })
          : await AccountService.list({ search, accountType: '', page, limit });
        setTableData(res.data ?? []);
        setTotalItems(res.total ?? res.data?.length ?? 0);
        setTotalPages(res.totalPages ?? 1);
      } catch {
        setTableData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [parentId]
  );

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);

  useEffect(() => {
    fetchAccounts(currentPage, entriesPerPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId, currentPage, entriesPerPage]);

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAccounts(1, entriesPerPage, searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchAccounts(1, entriesPerPage, '');
  };

  const columns: ColumnDef<AccountListItem>[] = useMemo(
    () => [
      {
        key: 'username',
        header: 'User Name',
        width: '160px',
        render: (row) => (
          <span
            className="account-username-badge cursor-pointer hover:underline"
            onClick={() => navigate(ROUTES.CLIENTS_DOWNLINE(row.id))}
          >
            {row.username}
          </span>
        ),
      },
      { key: 'creditReference', header: 'Credit Referance', width: '160px', align: 'right' },
      { key: 'uSt', header: 'U st', width: '80px', align: 'center' },
      { key: 'bSt', header: 'B st', width: '80px', align: 'center' },
      { key: 'exposure', header: 'Exposure Limit', width: '140px', align: 'right' },
      { key: 'defaultPct', header: 'Deafult (%)', width: '120px', align: 'center' },
      {
        key: 'accountType',
        header: 'Account Type',
        width: '140px',
        align: 'center',
        render: (row) => ROLE_HIERARCHY.find((r) => r.accountType === row.accountType)?.label || row.accountType,
      },
      {
        key: 'action',
        header: 'Action',
        width: '280px',
        align: 'center',
        sortable: false,
        render: (row) => (
          <div className="account-action-btns">
            <button
              type="button"
              className="account-action-btn"
              title="Deposit"
              onClick={() => setTxnModal({ account: row, type: 'deposit' })}
            >
              D
            </button>
            <button
              type="button"
              className="account-action-btn"
              title="Withdraw"
              onClick={() => setTxnModal({ account: row, type: 'withdraw' })}
            >
              W
            </button>
            <button
              type="button"
              className="account-action-btn"
              title="Exposure Limit"
              onClick={() => setExposureLimitAccount(row)}
            >
              L
            </button>
            <button
              type="button"
              className="account-action-btn"
              title="Credit"
              onClick={() => setCreditAccount(row)}
            >
              C
            </button>
            <button
              type="button"
              className="account-action-btn"
              title="Password"
              onClick={() => setPasswordAccount(row)}
            >
              P
            </button>
            <button
              type="button"
              className="account-action-btn"
              title="Change Status"
              onClick={() => setStatusAccount(row)}
            >
              S
            </button>
            <button type="button" className="account-action-btn account-action-btn-more" title="More">MORE</button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="client-list-wrapper">
      {/* Title & Top Action Button */}
      <div className="client-list-header">
        <h4 className="client-list-title">
          {parentId ? 'Downline' : 'Account List'}
        </h4>
        <div className="flex items-center gap-2">
          {parentId && (
            <button
              type="button"
              className="btn-reset-data"
              onClick={() => navigate(ROUTES.CLIENTS)}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className="btn-add-account"
            onClick={() => navigate(ROUTES.INSERT_USER)}
          >
            Add Account
          </button>
        </div>
      </div>

      <div className="client-list-card">
        {/* PDF & Excel Action Buttons */}
        <div className="client-list-actions-bar">
          <button type="button" className="btn-export-pdf">
            <i className="far fa-file-pdf mr-1 text-[14px]"></i>
            PDF
          </button>
          <button type="button" className="btn-export-excel">
            <i className="far fa-file-excel mr-1 text-[14px]"></i>
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
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          emptyMessage="There are no records to show"
        />

        {/* Pagination */}
        <div className="client-list-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {txnModal && (
        <AccountTransactionModal
          isOpen={!!txnModal}
          onClose={() => setTxnModal(null)}
          account={txnModal.account}
          type={txnModal.type}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm)}
        />
      )}

      {exposureLimitAccount && (
        <ExposureLimitModal
          isOpen={!!exposureLimitAccount}
          onClose={() => setExposureLimitAccount(null)}
          account={exposureLimitAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm)}
        />
      )}

      {creditAccount && (
        <CreditModal
          isOpen={!!creditAccount}
          onClose={() => setCreditAccount(null)}
          account={creditAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm)}
        />
      )}

      {passwordAccount && (
        <PasswordModal
          isOpen={!!passwordAccount}
          onClose={() => setPasswordAccount(null)}
          account={passwordAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm)}
        />
      )}

      {statusAccount && (
        <ChangeStatusModal
          isOpen={!!statusAccount}
          onClose={() => setStatusAccount(null)}
          account={statusAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm)}
        />
      )}
    </div>
  );
}
