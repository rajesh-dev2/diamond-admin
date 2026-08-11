import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function RootPage() {
  return <Navigate to={ROUTES.MARKET_ANALYSIS} replace />;
}
