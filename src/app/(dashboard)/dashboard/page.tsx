import React from 'react';
import { MarketDetail } from '@/components/market/MarketDetail';
import './style.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page-wrapper">
      <MarketDetail />
    </div>
  );
}
