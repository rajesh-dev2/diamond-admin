import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ReportsService, BalanceSummary } from '@/services/reports.service';
import './style.css';

const EMPTY_SUMMARY: BalanceSummary = {
  upperLevelCreditReference: 0,
  totalMasterBalance: 0,
  availableBalance: 0,
  downLevelOccupyBalance: 0,
  upperLevel: 0,
  availableBalanceWithProfitLoss: 0,
  downLevelCreditReference: 0,
  downLevelProfitLoss: 0,
  myProfitLoss: 0,
};

export function HeaderSummaryBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<BalanceSummary>(EMPTY_SUMMARY);

  useEffect(() => {
    ReportsService.getBalanceSummary().then(setSummary);
  }, []);

  const columns: { label: string; value: number }[][] = [
    [
      { label: 'Upper Level Credit Referance:', value: summary.upperLevelCreditReference },
      { label: 'Total Master Balance', value: summary.totalMasterBalance },
      { label: 'Available Balance:', value: summary.availableBalance },
    ],
    [
      { label: 'Down level Occupy Balance:', value: summary.downLevelOccupyBalance },
      { label: 'Upper Level:', value: summary.upperLevel },
      { label: 'Available Balance With Profit/Loss:', value: summary.availableBalanceWithProfitLoss },
    ],
    [
      { label: 'Down Level Credit Referance:', value: summary.downLevelCreditReference },
      { label: 'Down Level Profit/Loss :', value: summary.downLevelProfitLoss },
      { label: 'My Profit/Loss:', value: summary.myProfitLoss },
    ],
  ];

  return (
    <div className="header-summary-bar">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="header-summary-toggle"
        title={isOpen ? 'Collapse' : 'Expand'}
      >
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="header-summary-grid">
          {columns.map((column, colIdx) => (
            <div key={colIdx} className="header-summary-column">
              {column.map((stat) => (
                <div key={stat.label} className="header-summary-row">
                  <span className="header-summary-label">{stat.label}</span>
                  <span className="header-summary-value">{stat.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeaderSummaryBar;
