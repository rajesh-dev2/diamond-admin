import React, { useCallback, useEffect, useState } from 'react';
import NavTabs, { TabItem } from '@/components/common/NavTabs';
import RadioGroup, { RadioOption } from '@/components/common/RadioGroup';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import { ReportsService } from '@/services/reports.service';
import { AccountService } from '@/services/account.service';
import { ROLE_HIERARCHY } from '@/constants/roles';

const CURRENT_BETS_TABS: TabItem[] = [
  { id: 'sports', label: 'Sports' },
  { id: 'casino', label: 'Casino' },
];

const STATUS_RADIO_OPTIONS: RadioOption[] = [
  { label: 'Matched', value: 'matched' },
  { label: 'Deleted', value: 'deleted' },
  { label: 'All', value: 'all' },
];

const BET_TYPE_RADIO_OPTIONS: RadioOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Back', value: 'back' },
  { label: 'Lay', value: 'lay' },
];

const SPORTS_COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '80px' },
  { key: 'userRate', header: 'Rate', width: '100px', align: 'right' },
  { key: 'amount', header: 'Amount', width: '120px', align: 'right' },
  { key: 'otype', header: 'Mode', width: '100px', align: 'center' },
  { key: 'nation', header: 'Team', width: '200px' },
  { key: 'client', header: 'Client', width: '140px' },
  { key: 'agentLevel', header: 'Agent', width: '140px' },
  { key: 'eventName', header: 'Match', width: '260px' },
  { key: 'marketName', header: 'Market', width: '160px' },
  { key: 'placeDate', header: 'Place Date', width: '160px' },
];

const CASINO_COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '80px' },
  { key: 'client', header: 'Client', width: '140px' },
  { key: 'gameName', header: 'Game Name', width: '180px' },
  { key: 'roundId', header: 'Round ID', width: '160px' },
  { key: 'betAmount', header: 'Bet Amount', width: '120px', align: 'right' },
  { key: 'placeDate', header: 'Place Date', width: '160px' },
];

function getUplineLabel(accountType: string | undefined): string {
  if (!accountType) return '—';
  const index = ROLE_HIERARCHY.findIndex((entry) => entry.accountType === accountType);
  if (index <= 0) return '—';
  return ROLE_HIERARCHY[index - 1].label;
}

export default function CurrentBetsPage() {
  const [currentBetsTab, setCurrentBetsTab] = useState<'sports' | 'casino'>('sports');
  const [statusFilter, setStatusFilter] = useState('matched');
  const [betTypeFilter, setBetTypeFilter] = useState('all');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [betsData, setBetsData] = useState<any[]>([]);
  const [totalBets, setTotalBets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCurrentBets = useCallback(
    async (page: number, limit: number, search: string) => {
      setIsLoading(true);
      const res = await ReportsService.getCurrentBets({
        status: statusFilter,
        type: currentBetsTab,
        otype: betTypeFilter,
        clientId: '',
        search,
        limit,
        page,
      });
      const numbered = res.data.map((item, idx) => ({ ...item, srNo: (page - 1) * limit + idx + 1 }));
      setBetsData(numbered);
      setTotalPages(res.totalPages);
      setTotalBets(res.totalBets);
      setTotalAmount(res.totalAmount);
      setIsLoading(false);

      const uniqueClients = Array.from(new Set(numbered.map((item) => item.client).filter(Boolean)));
      if (uniqueClients.length > 0) {
        const accountTypeByClient: Record<string, string> = {};
        await Promise.all(
          uniqueClients.map(async (username) => {
            const accountRes = await AccountService.list({ search: username, limit: 5 });
            const match = accountRes.data?.find((acc) => acc.username === username);
            if (match) accountTypeByClient[username] = match.accountType;
          })
        );
        setBetsData((prev) =>
          prev.map((item) => ({
            ...item,
            agentLevel: getUplineLabel(accountTypeByClient[item.client]),
          }))
        );
      }
    },
    [currentBetsTab, statusFilter, betTypeFilter]
  );

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBetsTab]);

  useEffect(() => {
    fetchCurrentBets(currentPage, entriesPerPage, tableSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBetsTab, currentPage, entriesPerPage]);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCurrentBets(1, entriesPerPage, tableSearch);
  };

  const activeColumns = currentBetsTab === 'sports' ? SPORTS_COLUMNS : CASINO_COLUMNS;

  return (
    <div className="report-wrapper">
      <div className="report-header-bar">
        <h4 className="report-page-title">Current Bets</h4>
      </div>

      <NavTabs
        tabs={CURRENT_BETS_TABS}
        activeTab={currentBetsTab}
        onTabChange={(tabId) => setCurrentBetsTab(tabId as 'sports' | 'casino')}
      />

      <div className="report-card">
        <div className="current-bets-filter-bar">
          <form onSubmit={handleLoadData} className="current-bets-controls">
            {currentBetsTab === 'sports' && (
              <div className="current-bets-control-row">
                <RadioGroup
                  name="statusFilter"
                  options={STATUS_RADIO_OPTIONS}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
              </div>
            )}
            <div className="current-bets-control-row">
              <RadioGroup
                name="betTypeFilter"
                options={BET_TYPE_RADIO_OPTIONS}
                value={betTypeFilter}
                onChange={setBetTypeFilter}
              />
              <button type="submit" className="report-btn-load ml-2">
                Load
              </button>
            </div>
          </form>

          <div className="current-bets-summary">
            Total Bets: <span>{totalBets}</span> Total Amount: <span>{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <TableControls
          entriesPerPage={entriesPerPage}
          onEntriesChange={setEntriesPerPage}
          searchTerm={tableSearch}
          onSearchChange={setTableSearch}
        />

        <DataTable
          columns={activeColumns}
          data={betsData}
          isLoading={isLoading}
          emptyMessage="No data available in table"
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
