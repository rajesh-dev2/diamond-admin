import React, { useEffect, useState } from 'react';
import FormSelect, { SelectOption } from '@/components/common/FormSelect';
import TextInput from '@/components/common/TextInput';
import MultiSelect, { MultiSelectOption } from '@/components/common/MultiSelect';
import DatePicker from '@/components/common/DatePicker';
import TableControls from '@/components/common/TableControls';
import DataTable, { ColumnDef } from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import { ReportsService } from '@/services/reports.service';
import { AccountService } from '@/services/account.service';

const COLUMNS: ColumnDef<any>[] = [
  { key: 'date', header: 'Date', width: '120px' },
  { key: 'credit', header: 'Credit', width: '120px', align: 'right' },
  { key: 'debit', header: 'Debit', width: '120px', align: 'right' },
  { key: 'closing', header: 'Closing', width: '120px', align: 'right' },
  { key: 'description', header: 'Description', width: '350px' },
  { key: 'fromto', header: 'Fromto', width: '120px' },
];

export default function AccountStatementPage() {
  const [accountTypeOptions, setAccountTypeOptions] = useState<SelectOption[]>([]);
  const [accountType, setAccountType] = useState('');
  const [gameNameOptions, setGameNameOptions] = useState<SelectOption[]>([]);
  const [gameName, setGameName] = useState('allbalance');
  const [gameTypeOptions, setGameTypeOptions] = useState<SelectOption[]>([]);
  const [gameType, setGameType] = useState('');
  const isSportsReport = accountType === 'sport';
  const [clientSearch, setClientSearch] = useState('');
  const [clientOptions, setClientOptions] = useState<MultiSelectOption[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [fromDate, setFromDate] = useState('02/08/2026');
  const [toDate, setToDate] = useState('09/08/2026');

  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statementData, setStatementData] = useState<any[]>([]);

  useEffect(() => {
    ReportsService.getStatementTypes().then((options) => {
      setAccountTypeOptions(options);
      if (options.length > 0) {
        setAccountType(String(options[0].value));
      }
    });
  }, []);

  useEffect(() => {
    if (!accountType || accountType === 'all') {
      setGameNameOptions([]);
      setGameName('');
      return;
    }
    ReportsService.getGameNames(accountType).then((options) => {
      setGameNameOptions(options);
      if (options.length > 0) {
        setGameName(String(options[0].value));
      }
    });
  }, [accountType]);

  useEffect(() => {
    if (!isSportsReport || !gameName) {
      setGameTypeOptions([]);
      setGameType('');
      return;
    }
    ReportsService.getGameTypes(gameName).then((options) => {
      setGameTypeOptions(options);
      setGameType(options.length > 0 ? String(options[0].value) : '');
    });
  }, [isSportsReport, gameName]);

  useEffect(() => {
    const matchedOption = clientOptions.find((opt) => opt.label === clientSearch);
    if (matchedOption) {
      setSelectedClientId(matchedOption.value);
      return;
    }

    setSelectedClientId('');
    const timer = setTimeout(() => {
      AccountService.list({ search: clientSearch, limit: 25 }).then((res) => {
        setClientOptions(
          (res.data || []).map((item) => ({
            label: item.name ? `${item.name} (${item.username})` : item.username,
            value: item.id,
          }))
        );
      });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSearch]);

  const handleLoadData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    ReportsService.getAccountStatement({
      type: accountType,
      clientId: selectedClientId,
      gameType,
      gameName,
      from: fromDate,
      to: toDate,
    })
      .then(setStatementData)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="report-wrapper account-statement-page">
      <div className="report-header-bar">
        <h4 className="report-page-title">Account Statement</h4>
      </div>

      <div className="report-card">
        <div className="pb-3">
          <form onSubmit={handleLoadData}>
            <div className="report-form-fields row">
              <div className="col-lg-2">
                <FormSelect
                  className="report-filter-select"
                  label="Account Type"
                  value={accountType}
                  onChange={setAccountType}
                  options={accountTypeOptions}
                />
              </div>

              <div className="col-lg-2">
                <FormSelect
                  className="report-filter-select"
                  label="Game Name"
                  value={gameName}
                  onChange={setGameName}
                  options={gameNameOptions}
                />
              </div>

              {isSportsReport && (
                <div className="col-lg-2">
                  <FormSelect
                    className="report-filter-select"
                    label="Game Type"
                    value={gameType}
                    onChange={setGameType}
                    options={gameTypeOptions}
                  />
                </div>
              )}

              <div className="col-lg-2">
                <MultiSelect
                  label="Search By Client Name"
                  value={clientSearch}
                  onChange={setClientSearch}
                  options={clientOptions}
                  placeholder="Select option"
                />
              </div>

              <div className="col-lg-2">
                <DatePicker
                  className="report-filter-datepicker"
                  label="From"
                  value={fromDate}
                  onChange={setFromDate}
                />
              </div>

              <div className="col-lg-2">
                <DatePicker
                  className="report-filter-datepicker"
                  label="To"
                  value={toDate}
                  onChange={setToDate}
                />
              </div>
            </div>

            <div className="report-form-actions row mt-5">
              <div className="col-12">
                <button type="submit" className="report-btn-load">
                  Load
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
        />

        <DataTable
          columns={COLUMNS}
          data={statementData}
          isLoading={isLoading}
          emptyMessage="No data available in table"
          className="statement-table"
          footer={
            <tr role="row">
              <th role="columnheader" scope="col" aria-colindex={1}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={2} className="text-right"><span>0.00</span></th>
              <th role="columnheader" scope="col" aria-colindex={3} className="text-right"><span>0.00</span></th>
              <th role="columnheader" scope="col" aria-colindex={4} className="text-right"><span>0.00</span></th>
              <th role="columnheader" scope="col" aria-colindex={5}><span></span></th>
              <th role="columnheader" scope="col" aria-colindex={6}><span></span></th>
            </tr>
          }
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
