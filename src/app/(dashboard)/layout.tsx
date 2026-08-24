import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HeaderSummaryBar } from '@/components/layout/HeaderSummaryBar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Gold Header */}
      <Header />
      <HeaderSummaryBar />

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Collapsible Sports Drawer Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
          <div className="page-content flex-1 w-full flex flex-col">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
