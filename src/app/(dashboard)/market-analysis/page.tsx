import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import Loader from '@/components/common/Loader';
import { MarketDetail } from '@/components/market/MarketDetail';
import './style.css';

interface MarketAnalysisEntry {
  label: string;
  value: number;
}

interface MarketAnalysisColumn {
  name: string;
  entries: MarketAnalysisEntry[];
}

interface MarketAnalysisMatch {
  id: string;
  matchName: string;
  matchDate: string;
  columns: MarketAnalysisColumn[];
}

export default function MarketAnalysisPage() {
  const [searchParams] = useSearchParams();
  const [isLoading] = useState(false);
  const [matches] = useState<MarketAnalysisMatch[]>([]);

  // A match has been picked (via SportsTree or a saved link) — show the
  // full odds/betting board instead of the overview.
  if (searchParams.get('gmid')) {
    return (
      <div className="market-analysis-wrapper">
        <MarketDetail />
      </div>
    );
  }

  return (
    <div className="market-analysis-wrapper">
      <PageHeader title="Market Analysis" />

      {isLoading || matches.length === 0 && (
        <div className="market-analysis-list">
          {matches.map((match) => (
            <div key={match.id} className="market-analysis-card">
              <div className="game-header">
                <span className="game-header-name">{match.matchName}</span>
                <span>{match.matchDate}</span>
              </div>
              <div className="market-analysis-columns">
                {match.columns.map((col) => (
                  <div key={col.name} className="market-analysis-column">
                    <div className="market-analysis-column-title">{col.name}</div>
                    {col.entries.map((entry) => (
                      <div key={entry.label} className="market-analysis-row">
                        <span className="market-analysis-row-label">{entry.label}</span>
                        <span className={entry.value < 0 ? 'market-analysis-row-value-neg' : 'market-analysis-row-value'}>
                          {entry.value.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
