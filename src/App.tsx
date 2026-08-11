import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PageLoaderProvider } from '@/components/providers/PageLoaderProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import DashboardLayout from '@/app/(dashboard)/layout';
import LoginPage from '@/app/(auth)/login/page';
import DashboardPage from '@/app/(dashboard)/dashboard/page';
import ClientsPage from '@/app/(dashboard)/clients/page';
import InsertUserPage from '@/app/(dashboard)/clients/insertuser/page';
import AssignAgentPage from '@/app/(dashboard)/assign-agent/page';
import MarketAnalysisPage from '@/app/(dashboard)/market-analysis/page';
import LiveMarketPage from '@/app/(dashboard)/live-market/page';
import LiveVirtualMarketPage from '@/app/(dashboard)/live-virtual-market/page';
import ReportsPage from '@/app/(dashboard)/reports/page';
import SettingsPage from '@/app/(dashboard)/settings/page';

import '@/styles/index.css';

export function App() {
  return (
    <Provider store={store}>
      <ReactQueryProvider>
        <ThemeProvider>
          <BrowserRouter>
            <PageLoaderProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<LoginPage />} />

                {/* Protected Dashboard Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<Navigate to="/admin/market-analysis" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin/dashboard" element={<DashboardPage />} />

                  {/* List of Clients (admin/users) */}
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/users" element={<ClientsPage />} />
                  <Route path="/admin/users" element={<ClientsPage />} />

                  {/* Add Account / Insert User (admin/users/insertuser) */}
                  <Route path="/clients/insertuser" element={<InsertUserPage />} />
                  <Route path="/users/insertuser" element={<InsertUserPage />} />
                  <Route path="/admin/users/insertuser" element={<InsertUserPage />} />

                  {/* Assign Agent (admin/assign_agent) */}
                  <Route path="/assign-agent" element={<AssignAgentPage />} />
                  <Route path="/assign_agent" element={<AssignAgentPage />} />
                  <Route path="/admin/assign_agent" element={<AssignAgentPage />} />
                  <Route path="/admin/assign-agent" element={<AssignAgentPage />} />

                  {/* Market Analysis */}
                  <Route path="/market-analysis" element={<MarketAnalysisPage />} />
                  <Route path="/admin/market-analysis" element={<MarketAnalysisPage />} />

                  {/* Live Market */}
                  <Route path="/live-market" element={<LiveMarketPage />} />
                  <Route path="/admin/live-market" element={<LiveMarketPage />} />

                  {/* Live Virtual Market */}
                  <Route path="/live-virtual-market" element={<LiveVirtualMarketPage />} />
                  <Route path="/admin/live-virtual-market" element={<LiveVirtualMarketPage />} />

                  {/* Reports */}
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/reports/:slug" element={<ReportsPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/reports/:slug" element={<ReportsPage />} />

                  {/* Multi Login / Settings */}
                  <Route path="/createaccount" element={<SettingsPage />} />
                  <Route path="/admin/createaccount" element={<SettingsPage />} />
                </Route>

                {/* Catch all redirect */}
                <Route path="*" element={<Navigate to="/admin/market-analysis" replace />} />
              </Routes>
            </PageLoaderProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ReactQueryProvider>
    </Provider>
  );
}

export default App;
