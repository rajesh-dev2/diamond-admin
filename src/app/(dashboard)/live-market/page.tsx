import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import './style.css';

export default function LiveMarketPage() {
  return (
    <div className="live-market-wrapper">
      <PageHeader title="Live Market" />
      <div className="live-market-content">
        <p className="live-market-info-text">Live market feeds and in-play match odds appear here.</p>
      </div>
    </div>
  );
}
