import React, { useState } from 'react';
import NavTabs, { TabItem } from '@/components/common/NavTabs';
import RadioGroup, { RadioOption } from '@/components/common/RadioGroup';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';

const CURRENT_BETS_TABS: TabItem[] = [
  { id: 'sports', label: 'Sports' },
  { id: 'casino', label: 'Casino' },
];

const STATUS_RADIO_OPTIONS: RadioOption[] = [
  { label: 'Matched', value: 'matched' },
  { label: 'Deleted', value: 'deleted' },
];

const BET_TYPE_RADIO_OPTIONS: RadioOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Back', value: 'back' },
  { label: 'Lay', value: 'lay' },
];

const SPORTS_COLUMNS: ColumnDef<any>[] = [
  { key: 'srNo', header: 'Sr.No', width: '80px' },
  { key: 'rate', header: 'Rate', width: '100px', align: 'right' },
  { key: 'amount', header: 'Amount', width: '120px', align: 'right' },
  { key: 'mode', header: 'Mode', width: '100px', align: 'center' },
  { key: 'team', header: 'Team', width: '200px' },
  { key: 'client', header: 'Client', width: '140px' },
  { key: 'agent', header: 'Agent', width: '140px' },
  { key: 'market', header: 'Market', width: '220px' },

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

export default function CurrentBetsPage() {
  const [currentBetsTab, setCurrentBetsTab] = useState<'sports' | 'casino'>('sports');
  const [statusFilter, setStatusFilter] = useState('matched');
  const [betTypeFilter, setBetTypeFilter] = useState('all');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
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
            Total Soda: <span>0</span> Total Amount: <span>0.00</span>
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
          data={[]}
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
