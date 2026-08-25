import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';
import { useAppSelector } from '@/store/hooks';
import { OddsGroup, OddsData } from '../OddsBox';
import { OddsBox } from '../OddsBox';
import { BetTable, BetTableButton } from '../BetTable';
import { useMatchOddsSocket } from '@/hooks/useMatchOddsSocket';
import { MarketService } from '@/services/market.service';
import { BetsService, MatchBetItem, MatchBookItem } from '@/services/bets.service';
import './style.css';

// ── Live Data Types ──────────────────────────────────────────────────────────

interface LiveOdd {
  odds: number;
  otype: 'back' | 'lay';
  oname: string;  // back1 | back2 | back3 | lay1 | lay2 | lay3
  tno: number;
  size: number;
}

interface LiveSection {
  sid: number | string; // "Normal"/fancy markets send this as a string, MATCH_ODDS/Bookmaker as a number
  nat: string;
  gstatus: string;
  max: number;
  min: number;
  odds: LiveOdd[];
  br: boolean;
}

interface LiveMarket {
  mid: number;
  marketId: string; // string identifier used by the lock API — has a "_BM" suffix for Bookmaker markets
  mname: string;
  gtype: string;
  status: string;
  rem: string;
  sno: number;
  dtype: number;   // 4=match6box, 2=2box, 6=fancy, 8=oddeven, 9=casino, 10=khado
  ocnt: number;
  min: number;
  max: number;
  betLock: boolean;
  section: LiveSection[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtVol(size: number): string {
  if (!size || size <= 0) return '';
  if (size >= 10_000_000) {
    const val = size / 10_000_000;
    return `${Number.isInteger(val) ? val : val.toFixed(1)}Cr`;
  }
  if (size >= 100_000) {
    const val = size / 100_000;
    return `${Number.isInteger(val) ? val : val.toFixed(1)}L`;
  }
  if (size >= 1_000) {
    const val = size / 1_000;
    return `${Number.isInteger(val) ? val : val.toFixed(1)}K`;
  }
  return String(Math.round(size));
}

function getOdd(odds: LiveOdd[], name: string): LiveOdd | undefined {
  return odds.find(o => o.oname === name);
}

/** back3 (lightest) → back2 → back1 (darkest) for OddsGroup backOdds[0..2] */
function backGroup(odds: LiveOdd[], getTrendForOname: (oname: string) => 'down' | 'up' | null): (OddsData | null)[] {
  return ['back3', 'back2', 'back1'].map(name => {
    const o = getOdd(odds, name);
    return o && o.odds > 0 ? { odds: o.odds, volume: fmtVol(o.size), trend: getTrendForOname(name) } : null;
  });
}

/** lay1 (darkest) → lay2 → lay3 (lightest) for OddsGroup layOdds[0..2] */
function layGroup(odds: LiveOdd[], getTrendForOname: (oname: string) => 'down' | 'up' | null): (OddsData | null)[] {
  return ['lay1', 'lay2', 'lay3'].map(name => {
    const o = getOdd(odds, name);
    return o && o.odds > 0 ? { odds: o.odds, volume: fmtVol(o.size), trend: getTrendForOname(name) } : null;
  });
}

function marketCssClass(dtype: number): 'market-4' | 'market-6' | 'market-10' {
  if (dtype === 4 || dtype === 2) return 'market-4';
  if (dtype === 10) return 'market-10';
  return 'market-6';
}

function isMatchGtype(gtype: string) {
  return gtype === 'match' || gtype === 'match1';
}

function getSectionStatus(market: LiveMarket, section: LiveSection): string | null {
  if (market.status === 'SUSPENDED') return 'SUSPENDED';
  if (section.gstatus && section.gstatus !== 'ACTIVE') return section.gstatus;
  return null;
}

function isLockIconMarket(market: LiveMarket, section?: LiveSection): boolean {
  if (market.dtype === 10 || market.gtype === 'khado') return true;
  const mName = (market.mname || '').toUpperCase();
  if (mName.includes('LAMBI') || mName.includes('15 OVER') || mName.includes('10 OVER')) return true;
  if (section) {
    const sName = (section.nat || '').toUpperCase();
    if (sName.includes('LAMBI') || sName.includes('15 OVER') || sName.includes('NUMBER')) return true;
  }
  return false;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface MarketDetailProps {
  matchName?: string;
  matchDate?: string;
  gmid?: number | string;
  etid?: number | string;
}

export function MarketDetail({
  matchName: initialMatchName,
  matchDate: initialMatchDate,
  gmid: initialGmid,
  etid: initialEtid,
}: MarketDetailProps) {
  const [searchParams] = useSearchParams();
  const {
    selectedEtid,
    selectedGmid,
    selectedMatchName,
    selectedMatchDate,
    selectedLeagueName,
  } = useAppSelector((state) => state.sportsTree);

  // Priority: URL params > Redux state > prop defaults
  const activeGmid = Number(searchParams.get('gmid') ?? initialGmid ?? selectedGmid ?? 542267677);
  const activeEtid = Number(searchParams.get('etid') ?? initialEtid ?? selectedEtid ?? 1);

  // Decode text params from URL (URLSearchParams.get() already returns decoded values)
  const urlMatchName = searchParams.get('mn');
  const urlMatchDate = searchParams.get('md');
  const urlLeagueName = searchParams.get('ln');

  const activeMatchName = urlMatchName ?? initialMatchName ?? selectedMatchName ?? '';
  const activeMatchDate = urlMatchDate ?? initialMatchDate ?? selectedMatchDate ?? '';
  const activeLeagueName = urlLeagueName ?? selectedLeagueName ?? '';

  // Build the header title: "League > Match" or just "Match"
  const headerTitle = activeLeagueName
    ? `${activeLeagueName} > ${activeMatchName}`
    : activeMatchName || 'Market Detail';

  const { marketData, isConnected } = useMatchOddsSocket({ gmid: activeGmid, etid: activeEtid });

  const [activeTab, setActiveTab] = useState<'matched' | 'unmatched'>('matched');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchedBets, setMatchedBets] = useState<MatchBetItem[]>([]);
  const [unmatchedBets, setUnmatchedBets] = useState<MatchBetItem[]>([]);

  useEffect(() => {
    if (!activeGmid) return;

    const fetchBets = () => {
      BetsService.getMatchBets({ gmid: activeGmid, type: activeTab, status: 'PLACED', otype: 'all' }).then(
        (res) => {
          if (activeTab === 'matched') {
            setMatchedBets(res.matchedBets);
          } else {
            setUnmatchedBets(res.unmatchedBets);
          }
        }
      );
    };

    fetchBets();
    const interval = setInterval(fetchBets, 3000);
    return () => clearInterval(interval);
  }, [activeGmid, activeTab]);

  const [matchBook, setMatchBook] = useState<MatchBookItem[]>([]);

  useEffect(() => {
    if (!activeGmid) return;

    const fetchBook = () => {
      BetsService.getMatchBook(activeGmid).then(setMatchBook);
    };

    fetchBook();
    const interval = setInterval(fetchBook, 4000);
    return () => clearInterval(interval);
  }, [activeGmid]);

  const getBookValue = (mid: number | string, nat: string): number =>
    matchBook.find((b) => String(b.mid) === String(mid) && b.nat === nat)?.value ?? 0;

  const [modalTab, setModalTab] = useState<'matched' | 'deleted'>('matched');

  // ── Bet Lock / Unlock ───────────────────────────────────────────────────────
  const [lockingIds, setLockingIds] = useState<Set<string>>(new Set());

  const handleToggleLock = async (market: LiveMarket) => {
    const nextLocked = !market.betLock;
    setLockingIds((prev) => new Set(prev).add(market.marketId));
    try {
      await MarketService.setLock(market.marketId, nextLocked);
    } catch (err) {
      console.error(`Failed to ${nextLocked ? 'lock' : 'unlock'} market ${market.marketId}:`, err);
    } finally {
      setLockingIds((prev) => {
        const next = new Set(prev);
        next.delete(market.marketId);
        return next;
      });
    }
  };

  // ── Odds Trend Tracking ────────────────────────────────────────────────────
  // Keyed by market id too (not just section sid) — different markets can
  // reuse the same sid, and comparing across markets caused spurious flashes.
  /** key: `${mid}-${sid}-${oname}` → previous odds value */
  const prevOddsRef = useRef<Map<string, number>>(new Map());
  /** key: `${mid}-${sid}-${oname}` → 'down' | 'up' */
  const [trendMap, setTrendMap] = useState<Map<string, 'down' | 'up'>>(new Map());
  const trendResetRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const allMarkets = marketData as LiveMarket[];
    if (!allMarkets || allMarkets.length === 0) return;

    const newTrend = new Map<string, 'down' | 'up'>();

    for (const market of allMarkets) {
      for (const section of market.section) {
        for (const odd of section.odds) {
          const key = `${market.mid}-${section.sid}-${odd.oname}`;
          const prev = prevOddsRef.current.get(key);
          if (prev !== undefined && odd.odds !== prev) {
            newTrend.set(key, odd.odds < prev ? 'down' : 'up');
          }
          prevOddsRef.current.set(key, odd.odds);
        }
      }
    }

    if (newTrend.size > 0) {
      setTrendMap(newTrend);
      clearTimeout(trendResetRef.current);
      trendResetRef.current = setTimeout(() => setTrendMap(new Map()), 600);
    }

    return () => clearTimeout(trendResetRef.current);
  }, [marketData]);

  /** Look up the trend for a specific market + section + odd name */
  const getTrend = (mid: number, sid: number | string, oname: string): 'down' | 'up' | null =>
    trendMap.get(`${mid}-${sid}-${oname}`) ?? null;

  // Sort markets by sno ascending
  const markets: LiveMarket[] = [...(marketData as LiveMarket[])].sort((a, b) => a.sno - b.sno);

  // Fancy-style markets (fancy, khado, oddeven) = anything that isn't match odds/bookmaker or tied-match
  const fancyMids = useMemo(
    () =>
      markets
        .filter((m) => {
          const isMatch = m.gtype === 'match' || (m.gtype === 'match1' && m.dtype === 4);
          const isTwoBox = m.dtype === 2 || (m.mname || '').toUpperCase().includes('TIED MATCH');
          return !isMatch && !isTwoBox;
        })
        .map((m) => m.mid),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [marketData]
  );

  const [fancyBookMap, setFancyBookMap] = useState<Record<string, MatchBookItem[]>>({});

  useEffect(() => {
    if (fancyMids.length === 0) return;

    const fetchFancyBooks = () => {
      Promise.all(
        fancyMids.map((mid) => BetsService.getFancyBook(activeGmid).then((rows) => [String(mid), rows] as const))
      ).then((results) => setFancyBookMap(Object.fromEntries(results)));
    };

    fetchFancyBooks();
    const interval = setInterval(fetchFancyBooks, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fancyMids.join(',')]);

  const getFancyBookValue = (mid: number | string, nat: string): number =>
    (fancyBookMap[String(mid)] || []).find((b) => b.nat === nat)?.value ?? 0;

  // ── Market Section Renderers ─────────────────────────────────────────────

  /** 6-box Back/Lay rows (MATCH_ODDS, Bookmaker) */
  function renderMatchSections(market: LiveMarket) {
    return (
      <>
        {/* Header row */}
        <div className="bet-table-row bet-table-row-top">
          <div className="text-right nation-name">
            <span className="max-bet">
              Min:<span>{market.min > 0 ? fmtVol(market.min) : '—'}</span>{' '}
              Max:<span>{market.max > 0 ? fmtVol(market.max) : '—'}</span>
            </span>
          </div>
          <div className="back bl-title d-none-mobile">Back</div>
          <div className="lay bl-title d-none-mobile">Lay</div>
        </div>

        {market.section.map((section) => {
          const statusText = getSectionStatus(market, section);
          const isNotActive = !!statusText;
          return (
            <div
              key={section.sid}
              data-title={isNotActive ? statusText : undefined}
              className={`bet-table-row ${isNotActive ? 'suspendedtext' : ''}`}
            >
              <div className="nation-name d-none-mobile">
                <p>{section.nat}</p>
                <p className="mb-0 float-left position-red">{getBookValue(market.mid, section.nat)}</p>
                <p className="mb-0 float-right d-none">{getBookValue(market.mid, section.nat)}</p>
              </div>
              <OddsGroup
                backOdds={backGroup(section.odds, (oname) => getTrend(market.mid, section.sid, oname))}
                layOdds={layGroup(section.odds, (oname) => getTrend(market.mid, section.sid, oname))}
                disabled={isNotActive}
              />
            </div>
          );
        })}
      </>
    );
  }

  /** 2-box fancy rows (Normal, Over By Over, oddeven, etc.) — No (lay) | Yes (back) */
  function renderFancySections(market: LiveMarket, colLabels: [string, string] = ['No', 'Yes']) {
    return (
      <>
        {/* Header row */}
        <div className="bet-table-row">
          <div className="text-right nation-name"></div>
          <div className="lay bl-title d-none-mobile">{colLabels[0]}</div>
          <div className="back bl-title d-none-mobile">{colLabels[1]}</div>
        </div>

        {market.section.map((section) => {
          const statusText = getSectionStatus(market, section);
          const isNotActive = !!statusText;
          const backOdd = getOdd(section.odds, 'back1');
          const layOdd = getOdd(section.odds, 'lay1');
          const minVal = section.min || market.min;
          const maxVal = section.max || market.max;
          const hasBack = !!backOdd && backOdd.odds > 0;
          const hasLay = !!layOdd && layOdd.odds > 0;

          return (
            <div key={section.sid} className="fancy-tripple">
              <div
                data-title={isNotActive ? statusText : undefined}
                className={`bet-table-row ${isNotActive ? 'suspendedtext' : ''}`}
              >
                <div className="nation-name d-none-mobile">
                  <p>{section.nat}</p>
                  <p className="mb-0 position-red">{getFancyBookValue(market.mid, section.nat)}</p>
                </div>
                <OddsBox
                  type="lay"
                  odds={hasLay ? layOdd!.odds : '—'}
                  volume={hasLay ? fmtVol(layOdd!.size) : ''}
                  disabled={isNotActive || !hasLay}
                  trend={getTrend(market.mid, section.sid, 'lay1')}
                />
                <OddsBox
                  type="back"
                  odds={hasBack ? backOdd!.odds : '—'}
                  volume={hasBack ? fmtVol(backOdd!.size) : ''}
                  disabled={isNotActive || !hasBack}
                  trend={getTrend(market.mid, section.sid, 'back1')}
                />
                <div className="fancy-min-max">
                  <span>Min:{fmtVol(minVal) || '—'}</span>
                  <span>Max:{fmtVol(maxVal) || '—'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  /** khado rows — single Back box + min/max */
  function renderKhadoSections(market: LiveMarket) {
    return (
      <>
        <div className="bet-table-row">
          <div className="text-right nation-name"></div>
          <div className="back bl-title d-none-mobile">Back</div>
        </div>

        {market.section.map((section) => {
          const statusText = getSectionStatus(market, section);
          const isNotActive = !!statusText;
          const useLockIcon = isNotActive && isLockIconMarket(market, section);
          const backOdd = getOdd(section.odds, 'back1');
          const minVal = section.min || market.min;
          const maxVal = section.max || market.max;
          const hasBack = !!backOdd && backOdd.odds > 0;

          return (
            <div
              key={section.sid}
              data-title={isNotActive && !useLockIcon ? statusText : undefined}
              className={`bet-table-row ${isNotActive && !useLockIcon ? 'suspendedtext' : ''}`}
            >
              <div className="nation-name d-none-mobile">
                <p><span>{section.nat}</span></p>
                <p className="mb-0 position-red">{getFancyBookValue(market.mid, section.nat)}</p>
              </div>
              <OddsBox
                type="back"
                odds={hasBack ? backOdd!.odds : '—'}
                volume={hasBack ? fmtVol(backOdd!.size) : ''}
                disabled={!useLockIcon && (isNotActive || !hasBack)}
                suspended={useLockIcon}
                trend={getTrend(market.mid, section.sid, 'back1')}
              />
              <div className="fancy-min-max">
                <span>Min:{fmtVol(minVal) || '—'}</span>
                <span>Max:{fmtVol(maxVal) || '—'}</span>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  /** oddeven rows — two Back boxes (Odd | Even) */
  function renderOddEvenSections(market: LiveMarket) {
    return (
      <>
        <div className="bet-table-row">
          <div className="text-right nation-name"></div>
          <div className="back bl-title d-none-mobile">Odd</div>
          <div className="back bl-title d-none-mobile">Even</div>
        </div>

        {market.section.map((section) => {
          const statusText = getSectionStatus(market, section);
          const isNotActive = !!statusText;
          const useLockIcon = isNotActive && isLockIconMarket(market, section);
          const backOdd = getOdd(section.odds, 'back1');
          const layOdd = getOdd(section.odds, 'lay1');
          const minVal = section.min || market.min;
          const maxVal = section.max || market.max;
          const hasBack = !!backOdd && backOdd.odds > 0;
          const hasLay = !!layOdd && layOdd.odds > 0;

          return (
            <div key={section.sid} className="fancy-tripple">
              <div
                data-title={isNotActive && !useLockIcon ? statusText : undefined}
                className={`bet-table-row ${isNotActive && !useLockIcon ? 'suspendedtext' : ''}`}
              >
                <div className="nation-name d-none-mobile">
                  <p>{section.nat}</p>
                  <p className="mb-0 position-red">{getFancyBookValue(market.mid, section.nat)}</p>
                </div>
                <OddsBox
                  type="back"
                  odds={hasBack ? backOdd!.odds : '—'}
                  volume={hasBack ? fmtVol(backOdd!.size) : ''}
                  disabled={!useLockIcon && (isNotActive || !hasBack)}
                  suspended={useLockIcon}
                  trend={getTrend(market.mid, section.sid, 'back1')}
                />
                <OddsBox
                  type="back"
                  odds={hasLay ? layOdd!.odds : '—'}
                  volume={hasLay ? fmtVol(layOdd!.size) : ''}
                  disabled={!useLockIcon && (isNotActive || !hasLay)}
                  suspended={useLockIcon}
                  trend={getTrend(market.mid, section.sid, 'lay1')}
                />
                <div className="fancy-min-max">
                  <span>Min:{fmtVol(minVal) || '—'}</span>
                  <span>Max:{fmtVol(maxVal) || '—'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  /** 2-box Back/Lay sections (Tied Match - gtype='match1' & dtype=2) */
  function renderTwoBoxMatchSections(market: LiveMarket) {
    return (
      <div className="market-2-box">
        {/* Header row */}
        <div className="bet-table-row bet-table-row-top">
          <div className="text-right nation-name">
            <span className="max-bet">
              Min:<span>{market.min > 0 ? fmtVol(market.min) : '—'}</span>{' '}
              Max:<span>{market.max > 0 ? fmtVol(market.max) : '—'}</span>
            </span>
          </div>
          <div className="back bl-title d-none-mobile">Back</div>
          <div className="lay bl-title d-none-mobile">Lay</div>
        </div>

        {market.section.map((section) => {
          const statusText = getSectionStatus(market, section);
          const isNotActive = !!statusText;
          const backOdd = getOdd(section.odds, 'back1');
          const layOdd = getOdd(section.odds, 'lay1');
          const hasBack = !!backOdd && backOdd.odds > 0;
          const hasLay = !!layOdd && layOdd.odds > 0;

          return (
            <div
              key={section.sid}
              data-title={isNotActive ? statusText : undefined}
              className={`bet-table-row ${isNotActive ? 'suspendedtext' : ''}`}
            >
              <div className="nation-name d-none-mobile">
                <p>{section.nat}</p>
                <p className="mb-0 float-left position-red">{getBookValue(market.mid, section.nat)}</p>
                <p className="mb-0 float-right d-none">{getBookValue(market.mid, section.nat)}</p>
              </div>
              <div className="flex items-center">
                <OddsBox
                  type="back"
                  odds={hasBack ? backOdd!.odds : '—'}
                  volume={hasBack ? fmtVol(backOdd!.size) : ''}
                  disabled={isNotActive || !hasBack}
                  trend={getTrend(market.mid, section.sid, 'back1')}
                />
                <OddsBox
                  type="lay"
                  odds={hasLay ? layOdd!.odds : '—'}
                  volume={hasLay ? fmtVol(layOdd!.size) : ''}
                  disabled={isNotActive || !hasLay}
                  trend={getTrend(market.mid, section.sid, 'lay1')}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /** Choose renderer based on gtype/dtype */
  function renderMarketBody(market: LiveMarket) {
    const { gtype, dtype, mname } = market;
    if (dtype === 2 || (mname || '').toUpperCase().includes('TIED MATCH')) {
      return renderTwoBoxMatchSections(market);
    }
    if (gtype === 'match' || (gtype === 'match1' && dtype === 4)) {
      return renderMatchSections(market);
    }
    if (gtype === 'khado') {
      return renderKhadoSections(market);
    }
    if (gtype === 'oddeven') {
      return renderOddEvenSections(market);
    }
    // fancy, Over By Over, cricketcasino, meter, etc.
    return renderFancySections(market, ['No', 'Yes']);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="detail-page-container">
      {/* Center Main Market Content Area */}
      <div className="center-main-container">
        <div className="center-content">
          {/* Game Header Bar */}
          <div className="game-header">
            <span className="game-header-name" title={headerTitle}>{headerTitle}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {activeMatchDate && (
                <span>{activeMatchDate}</span>
              )}
            </span>
          </div>

          <div className="market-container mt-0">
            {markets.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: 13 }}>
                {isConnected ? 'Waiting for market data…' : 'Connecting to live feed…'}
              </div>
            ) : (
              markets.map((market, index) => {
                const cssClass = marketCssClass(market.dtype);
                const lockButton: BetTableButton = {
                  label: market.betLock ? 'Bet Unlock' : 'Bet Lock',
                  onClick: () => handleToggleLock(market),
                  disabled: lockingIds.has(market.marketId),
                };
                const buttons: BetTableButton[] = isMatchGtype(market.gtype)
                  ? [lockButton, { label: 'User Book' }]
                  : [lockButton];

                return (
                  <BetTable
                    key={market.mid}
                    title={market.mname}
                    buttons={buttons}
                    marketId={`market-${market.mid}`}
                    marketType={cssClass}
                    status={market.status}
                    remark={market.rem || undefined}
                    className={index === 0 ? 'first-market' : ''}
                  >
                    {renderMarketBody(market)}
                  </BetTable>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar Container */}
      <div className="right-sidebar-container">
        {/* Book Summary Card */}
        <div className="side-card">
          <div className="side-card-header">
            <span>Book Summary</span>
          </div>
        </div>

        {/* SCORE CARD */}
        <div className="side-card">
          <div className="side-card-header">
            <span>SCORE CARD</span>
          </div>
        </div>

        {/* MY BETS Card */}
        <div className="side-card">
          <div className="side-card-header">
            <span>MY BETS</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-view-more"
            >
              VIEW MORE
            </button>
          </div>

          {/* Tabs */}
          <div className="my-bets-tabs">
            <div
              onClick={() => setActiveTab('matched')}
              className={`my-bets-tab ${activeTab === 'matched' ? 'active' : ''}`}
            >
              Matched Bets
            </div>
            <div
              onClick={() => setActiveTab('unmatched')}
              className={`my-bets-tab ${activeTab === 'unmatched' ? 'active' : ''}`}
            >
              Unmatched Bets
            </div>
          </div>

          {/* Table */}
          <table className="my-bets-table">
            <thead>
              <tr>
                <th>UserName</th>
                <th>Nation</th>
                <th>Rate</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'matched' ? matchedBets : unmatchedBets).length === 0 ? (
                <tr>
                  <td colSpan={4} className="no-records">
                    No records found
                  </td>
                </tr>
              ) : (
                (activeTab === 'matched' ? matchedBets : unmatchedBets).map((bet, idx) => (
                  <tr key={idx} style={{ backgroundColor: bet.otype === 'lay' ? '#ffa2b6' : '#72bbef' }}>
                    <td>{bet.username}</td>
                    <td>{bet.nation}</td>
                    <td>{bet.rate}</td>
                    <td className="text-right">{bet.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="View More"
        size="xl"
        position="top"
      >
        <div className="modal-inner-card">
          {/* Tabs */}
          <div className="modal-tabs">
            <button
              onClick={() => setModalTab('matched')}
              className={`modal-tab ${modalTab === 'matched' ? 'active' : ''}`}
            >
              Matched Bets
            </button>
            <button
              onClick={() => setModalTab('deleted')}
              className={`modal-tab ${modalTab === 'deleted' ? 'active' : ''}`}
            >
              Deleted Bets
            </button>
          </div>

          {/* Table Content */}
          <div className="modal-no-records">
            No records found
          </div>
        </div>
      </Modal>
    </div>
  );
}
