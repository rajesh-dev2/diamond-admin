import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import './style.css';

export default function LiveVirtualMarketPage() {
  return (
    <div className="live-virtual-market-wrapper">
      <PageHeader title="Live Virtual Market" />
      <div className="live-virtual-market-content">
        <p className="live-virtual-market-info-text">
          Virtual sports, Teenpatti, Lucky 7, and Casino markets will appear here.
        </p>
      </div>
    </div>
  );
}
