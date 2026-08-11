import React from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import AccountStatementPage from './AccountStatement';
import CurrentBetsPage from './CurrentBets';
import GeneralReportPage from './GeneralReport';
import GameReportPage from './GameReport';
import CasinoReportPage from './CasinoReport';
import ProfitLossPage from './ProfitLoss';
import CasinoResultPage from './CasinoResult';
import GeneralLockPage from './GeneralLock';
import UserRegisterDetailPage from './UserRegisterDetail';
import TotalProfitLossPage from './TotalProfitLoss';
import UserWinLossPage from './UserWinLoss';
import './styles.css';

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const activeSlug =
    params.slug ||
    searchParams.get('type') ||
    'accountstatement';

  switch (activeSlug) {
    case 'accountstatement':
      return <AccountStatementPage />;
    case 'currentbets':
      return <CurrentBetsPage />;
    case 'generalreport':
      return <GeneralReportPage />;
    case 'gamereport':
      return <GameReportPage />;
    case 'livecasinoreport':
      return <CasinoReportPage />;
    case 'profitloss':
      return <ProfitLossPage />;
    case 'casinoresult':
      return <CasinoResultPage />;
    case 'userlock':
      return <GeneralLockPage />;
    case 'userregisterdetail':
      return <UserRegisterDetailPage />;
    case 'totalprofitloss':
      return <TotalProfitLossPage />;
    case 'userwinloss':
      return <UserWinLossPage />;
    default:
      return <AccountStatementPage />;
  }
}

export {
  AccountStatementPage,
  CurrentBetsPage,
  GeneralReportPage,
  GameReportPage,
  CasinoReportPage,
  ProfitLossPage,
  CasinoResultPage,
  GeneralLockPage,
  UserRegisterDetailPage,
  TotalProfitLossPage,
  UserWinLossPage,
};
