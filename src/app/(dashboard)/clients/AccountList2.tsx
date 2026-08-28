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

export default function AccountList2Page() {
  const navigate = useNavigate();
  const { id: parentId } = useParams<{ id: string }>();
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [tableData, setTableData] = useState<AccountListItem[]>([]);
  const [txnModal, setTxnModal] = useState<{ account: AccountListItem; type: TransactionType } | null>(null);
  const [exposureLimitAccount, setExposureLimitAccount] = useState<AccountListItem | null>(null);
  const [creditAccount, setCreditAccount] = useState<AccountListItem | null>(null);
  const [passwordAccount, setPasswordAccount] = useState<AccountListItem | null>(null);
  const [statusAccount, setStatusAccount] = useState<AccountListItem | null>(null);

  const fetchAccounts = useCallback(
    async (page: number, limit: number, search: string, tab: 'active' | 'inactive') => {
      setIsLoading(true);
      try {
        const isActive = tab === 'active' ? 'true' : 'false';
        const res = parentId
          ? await AccountService.getDownline(parentId, { search, accountType: '', isActive, page, limit })
          : await AccountService.list({ search, accountType: '', isActive, page, limit });
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
    fetchAccounts(currentPage, entriesPerPage, searchTerm, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId, currentPage, entriesPerPage, activeTab]);

  const handleTabChange = (tab: 'active' | 'inactive') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAccounts(1, entriesPerPage, searchTerm, activeTab);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchAccounts(1, entriesPerPage, '', activeTab);
  };

  const formatCurrency = (val: any) => {
    if (val === null || val === undefined || val === '') return '0';
    const n = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
    if (isNaN(n)) return String(val);
    return n.toLocaleString('en-IN');
  };

  const displayData = useMemo(() => {
    if (tableData.length === 0) return [];

    const parseNum = (v: any) => {
      if (typeof v === 'number') return v;
      if (!v) return 0;
      const n = parseFloat(String(v).replace(/,/g, ''));
      return isNaN(n) ? 0 : n;
    };

    const totalCR = tableData.reduce((acc, r) => acc + parseNum(r.creditReference), 0);
    const totalBalance = tableData.reduce((acc, r) => acc + parseNum(r.balance), 0);
    const totalClientPL = tableData.reduce((acc, r) => acc + parseNum(r.clientPL), 0);
    const totalAvailBal = tableData.reduce((acc, r) => acc + parseNum(r.availableBalance), 0);

    const summaryRow: any = {
      id: '__summary-row__',
      isSummary: true,
      username: '',
      creditReference: formatCurrency(totalCR),
      balance: formatCurrency(totalBalance),
      clientPL: formatCurrency(totalClientPL),
      exposure: '',
      availableBalance: formatCurrency(totalAvailBal),
      ust: false,
      bst: false,
      exposureLimit: '',
      defaultPercent: '',
      accountType: '',
    };

    return [summaryRow, ...tableData];
  }, [tableData]);

  const columns: ColumnDef<AccountListItem>[] = useMemo(
    () => [
      {
        key: 'username',
        header: 'User Name',
        width: '153px',
        align: 'left',
        render: (row: any) =>
          row.isSummary ? null : (
            <span
              className="wrape-text cursor-pointer hover:opacity-90"
              onClick={() => navigate(ROUTES.ACCOUNT_LIST_DOWNLINE(row.id))}
            >
              {row.username}
            </span>
          ),
      },
      {
        key: 'creditReference',
        header: 'CR',
        width: '61px',
        align: 'right',
        render: (row: any) =>
          row.isSummary ? (
            <strong className="font-bold text-[#1e1e1e]">{row.creditReference}</strong>
          ) : (
            formatCurrency(row.creditReference)
          ),
      },
      {
        key: 'balance',
        header: 'Balance',
        width: '70px',
        align: 'right',
        render: (row: any) =>
          row.isSummary ? (
            <strong className="font-bold text-[#1e1e1e]">{row.balance}</strong>
          ) : (
            formatCurrency(row.balance)
          ),
      },
      {
        key: 'clientPL',
        header: 'Client(P/L)',
        width: '86px',
        align: 'right',
        render: (row: any) =>
          row.isSummary ? (
            <strong className="font-bold text-[#1e1e1e]">{row.clientPL}</strong>
          ) : (
            formatCurrency(row.clientPL)
          ),
      },
      {
        key: 'exposure',
        header: 'Exposure',
        width: '63px',
        align: 'right',
        render: (row: any) => (row.isSummary ? '' : formatCurrency(row.exposure ?? 0)),
      },
      {
        key: 'availableBalance',
        header: 'Available Balance',
        width: '62px',
        align: 'right',
        render: (row: any) =>
          row.isSummary ? (
            <strong className="font-bold text-[#1e1e1e]">{row.availableBalance}</strong>
          ) : (
            formatCurrency(row.availableBalance)
          ),
      },
      {
        key: 'ust',
        header: 'U st',
        width: '55px',
        align: 'left',
        render: (row: any) =>
          row.isSummary ? null : (
            <div className="custom-control custom-checkbox inline-flex items-center justify-center">
              <input
                type="checkbox"
                disabled
                checked={Boolean(row.ust ?? row.isActive ?? true)}
                className="custom-control-input"
                readOnly
              />
              <label className="custom-control-label" />
            </div>
          ),
      },
      {
        key: 'bst',
        header: 'B st',
        width: '55px',
        align: 'left',
        render: (row: any) =>
          row.isSummary ? null : (
            <div className="custom-control custom-checkbox inline-flex items-center justify-center">
              <input
                type="checkbox"
                disabled
                checked={Boolean(row.bst ?? true)}
                className="custom-control-input"
                readOnly
              />
              <label className="custom-control-label" />
            </div>
          ),
      },
      {
        key: 'exposureLimit',
        header: 'Exposure Limit',
        width: '63px',
        align: 'left',
        render: (row: any) => (row.isSummary ? '' : formatCurrency(row.exposureLimit ?? 0)),
      },
      {
        key: 'defaultPercent',
        header: 'Default(%)',
        width: '70px',
        align: 'left',
        render: (row: any) => (row.isSummary ? '' : <p className="text-left mb-0">{row.defaultPercent ?? '0'}</p>),
      },
      {
        key: 'accountType',
        header: 'Account Type',
        width: '71px',
        align: 'left',
        render: (row: any) =>
          row.isSummary
            ? null
            : ROLE_HIERARCHY.find((r) => r.accountType === row.accountType)?.label ||
              (row.accountType === 'master' ? 'Master' : row.accountType === 'user' ? 'User' : row.accountType),
      },
      {
        key: 'action',
        header: 'Action',
        width: '225px',
        align: 'left',
        render: (row: any) =>
          row.isSummary ? null : (
            <div className="btn-group">
              <button
                type="button"
                className="btn action-button btn-secondary"
                title="Deposit"
                onClick={() => setTxnModal({ account: row, type: 'deposit' })}
              >
                D
              </button>
              <button
                type="button"
                className="btn action-button btn-secondary"
                title="Withdraw"
                onClick={() => setTxnModal({ account: row, type: 'withdraw' })}
              >
                W
              </button>
              <button
                type="button"
                className="btn action-button btn-secondary"
                title="Exposure Limit"
                onClick={() => setExposureLimitAccount(row)}
              >
                L
              </button>
              <button
                type="button"
                className="btn action-button btn-secondary"
                title="Credit"
                onClick={() => setCreditAccount(row)}
              >
                C
              </button>
              <button
                type="button"
                className="btn action-button btn-secondary"
                title="Password"
                onClick={() => setPasswordAccount(row)}
              >
                P
              </button>
              <button
                type="button"
                className="btn action-button btn-secondary"
                title="Change Status"
                onClick={() => setStatusAccount(row)}
              >
                S
              </button>
            </div>
          ),
      },
    ],
    [navigate]
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
              onClick={() => navigate(ROUTES.ACCOUNT_LIST)}
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

        {/* Active / Deactive Users Tabs */}
        <div className="account-list-tabs">
          <button
            type="button"
            className={`account-list-tab ${activeTab === 'active' ? 'account-list-tab-active' : ''}`}
            onClick={() => handleTabChange('active')}
          >
            Active Users
          </button>
          <button
            type="button"
            className={`account-list-tab ${activeTab === 'inactive' ? 'account-list-tab-active' : ''}`}
            onClick={() => handleTabChange('inactive')}
          >
            Deactive Users
          </button>
        </div>

        {/* PDF & Excel Action Buttons */}
        <div className="client-list-actions-bar">
          <button type="button" className="btn-export-pdf">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            PDF
          </button>
          <button type="button" className="btn-export-excel">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            Excel
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={displayData}
          isLoading={isLoading}
          emptyMessage="There are no records to show"
          className='table-client-list'
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
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm, activeTab)}
        />
      )}

      {exposureLimitAccount && (
        <ExposureLimitModal
          isOpen={!!exposureLimitAccount}
          onClose={() => setExposureLimitAccount(null)}
          account={exposureLimitAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm, activeTab)}
        />
      )}

      {creditAccount && (
        <CreditModal
          isOpen={!!creditAccount}
          onClose={() => setCreditAccount(null)}
          account={creditAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm, activeTab)}
        />
      )}

      {passwordAccount && (
        <PasswordModal
          isOpen={!!passwordAccount}
          onClose={() => setPasswordAccount(null)}
          account={passwordAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm, activeTab)}
        />
      )}

      {statusAccount && (
        <ChangeStatusModal
          isOpen={!!statusAccount}
          onClose={() => setStatusAccount(null)}
          account={statusAccount}
          onSuccess={() => fetchAccounts(currentPage, entriesPerPage, searchTerm, activeTab)}
        />
      )}
    </div>
  );
}
