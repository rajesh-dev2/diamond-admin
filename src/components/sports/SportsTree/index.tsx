import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleNodeExpand, setIsOpen } from '@/store/slices/sidebarSlice';
import {
  fetchSportsThunk,
  fetchLeaguesThunk,
  fetchDatesThunk,
  fetchMatchesThunk,
  fetchMarketsThunk,
  setSelectedMatch,
} from '@/store/slices/sportsTreeSlice';
import './style.css';

export function SportsTree() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux Toolkit Selectors
  const { isOpen, expandedNodes } = useAppSelector((state) => state.sidebar);
  const { sports, leaguesMap, datesMap, matchesMap, marketsMap } = useAppSelector(
    (state) => state.sportsTree
  );

  // Fetch Root Sports on Mount via RTK AsyncThunk
  useEffect(() => {
    dispatch(fetchSportsThunk());
  }, [dispatch]);

  // Handle Sport Node Click (etid -> treedata2)
  const handleSportClick = (etid: number | string) => {
    const nodeKey = `sport-${etid}`;
    dispatch(toggleNodeExpand(nodeKey));

    const isExpanding = !expandedNodes[nodeKey];
    if (isExpanding && !leaguesMap[String(etid)]) {
      dispatch(fetchLeaguesThunk(etid));
    }
  };

  // Handle Competition/League Node Click (cid -> treedata3)
  const handleLeagueClick = (cid: string | number) => {
    const nodeKey = `league-${cid}`;
    dispatch(toggleNodeExpand(nodeKey));

    const isExpanding = !expandedNodes[nodeKey];
    if (isExpanding && !datesMap[String(cid)]) {
      dispatch(fetchDatesThunk(cid));
    }
  };

  // Handle Date Node Click (cid, dt -> treedata4)
  const handleDateClick = (cid: string | number, dt: string) => {
    const nodeKey = `date-${cid}-${dt}`;
    dispatch(toggleNodeExpand(nodeKey));

    const matchKey = `${cid}_${dt}`;
    const isExpanding = !expandedNodes[nodeKey];
    if (isExpanding && !matchesMap[matchKey]) {
      dispatch(fetchMatchesThunk({ cid, dt }));
    }
  };

  // Handle Match Node Click (gmid -> treedata5)
  const handleMatchClick = (gmid: string | number) => {
    const nodeKey = `match-${gmid}`;
    dispatch(toggleNodeExpand(nodeKey));

    const isExpanding = !expandedNodes[nodeKey];
    if (isExpanding && !marketsMap[String(gmid)]) {
      dispatch(fetchMarketsThunk(gmid));
    }
  };

  // Update Redux state on match/market selection (navigation is handled at each call site)
  const selectMatch = ({
    etid,
    gmid,
    matchName,
    matchDate,
    sportName,
    leagueName,
  }: {
    etid: number | string;
    gmid: number | string;
    matchName?: string;
    matchDate?: string;
    sportName?: string;
    leagueName?: string;
  }) => {
    dispatch(setSelectedMatch({ etid, gmid, matchName, matchDate, sportName, leagueName }));
  };

  /** Build the full URL search string with all context params */
  const buildParams = ({
    gmid,
    etid,
    matchName,
    matchDate,
    leagueName,
  }: {
    gmid: number | string;
    etid: number | string;
    matchName?: string;
    matchDate?: string;
    leagueName?: string;
  }) => {
    const p = new URLSearchParams();
    p.set('gmid', String(gmid));
    p.set('etid', String(etid));
    if (matchName) p.set('mn', matchName);
    if (matchDate) p.set('md', matchDate);
    if (leagueName) p.set('ln', leagueName);
    return p.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="sports-tree-container">
      {/* Header: Scrolls together with content */}
      <div className="sports-tree-header">
        <h2 className="sports-tree-title">
          Sports
        </h2>
        <button
          onClick={() => dispatch(setIsOpen(false))}
          className="p-0.5 text-[#000000] hover:text-[#444444] transition-colors cursor-pointer"
          title="Close"
        >
          <i className="fa fa-times text-[1.25rem]"></i>
        </button>
      </div>

      {/* Tree Content Area */}
      <div className="py-1 px-1">
        {sports.map((sport) => {
          const sportKey = `sport-${sport.etid}`;
          const isSportExpanded = !!expandedNodes[sportKey];
          const leagues = leaguesMap[String(sport.etid)] || [];
          const hasLeagues = leagues.length > 0;

          return (
            <div key={sportKey} className="flex flex-col">
              {/* Level 1: Sport Item (e.g. Football +, Tennis +) */}
              <div
                onClick={() => handleSportClick(sport.etid)}
                className="sports-tree-node-item"
              >
                <span>{sport.ename}</span>
                <span className="ml-1.5 font-bold shrink-0 text-[14px]">{isSportExpanded ? '-' : '+'}</span>
              </div>

              {/* Level 2: Leagues Container */}
              {isSportExpanded && hasLeagues && (
                <div className="relative flex flex-col ml-[15px] pl-[4px] border-l border-[#333333] my-0.5 space-y-[1px] first">
                  {leagues.map((league) => {
                    const leagueKey = `league-${league.cid}`;
                    const isLeagueExpanded = !!expandedNodes[leagueKey];
                    const dates = datesMap[String(league.cid)] || [];
                    const hasDates = dates.length > 0;

                    return (
                      <div key={leagueKey} className="flex flex-col">
                        {/* League Item Row with Gold Dot */}
                        <div className="relative flex items-center">
                          <span className="sports-tree-gold-dot" />

                          <div
                            onClick={() => handleLeagueClick(league.cid)}
                            className="py-[2px] px-1 text-[12px] leading-[15px] font-normal text-[#1e1e1e] cursor-pointer whitespace-normal break-words flex items-center w-full"
                          >
                            <span>{league.cname}</span>
                            <span className="ml-1.5 font-bold shrink-0 text-[14px]">{isLeagueExpanded ? '-' : '+'}</span>
                          </div>
                        </div>

                        {/* Level 3: Dates Container */}
                        {isLeagueExpanded && hasDates && (
                          <div className="relative flex flex-col ml-[6px] pl-[4px] border-l border-[#333333] my-0.5 space-y-[1px]">
                            {dates.map((dateObj) => {
                              const dateKey = `date-${league.cid}-${dateObj.dt}`;
                              const isDateExpanded = !!expandedNodes[dateKey];
                              const matchKey = `${league.cid}_${dateObj.dt}`;
                              const matches = matchesMap[matchKey] || [];
                              const hasMatches = matches.length > 0;

                              return (
                                <div key={dateKey} className="flex flex-col">
                                  {/* Date Item Row with Gold Dot */}
                                  <div className="relative flex items-center">
                                    <span className="sports-tree-gold-dot" />

                                    <div
                                      onClick={() => handleDateClick(league.cid, dateObj.dt)}
                                      className="py-[2px] px-1 text-[12px] leading-[15px] font-normal text-[#1e1e1e] cursor-pointer whitespace-normal break-words flex items-center w-full"
                                    >
                                      <span>{dateObj.dt}</span>
                                      <span className="ml-1.5 font-bold shrink-0 text-[14px]">{isDateExpanded ? '-' : '+'}</span>
                                    </div>
                                  </div>

                                  {/* Level 4: Events/Matches Container */}
                                  {isDateExpanded && hasMatches && (
                                    <div className="relative flex flex-col ml-[6px] pl-[4px] border-l border-[#333333] my-0.5 space-y-[1px]">
                                      {matches.map((match) => {
                                        const gmid = match.gmid || match.eid;
                                        const eventKey = `match-${gmid}`;
                                        const isMatchExpanded = !!expandedNodes[eventKey];
                                        const markets = marketsMap[String(gmid)] || match.markets || [];
                                        const hasMarkets = markets.length > 0;

                                        return (
                                          <div key={eventKey} className="flex flex-col">
                                            {/* Event Item Row with Gold Dot */}
                                            <div className="relative flex items-center">
                                              <span className="sports-tree-gold-dot" />

                                              <div
                                                onClick={() => {
                                                  selectMatch({
                                                    etid: sport.etid,
                                                    gmid,
                                                    matchName: match.ename,
                                                    matchDate: dateObj.dt,
                                                    sportName: sport.ename,
                                                    leagueName: league.cname,
                                                  });
                                                  navigate(
                                                    {
                                                      pathname: '/market-analysis',
                                                      search: buildParams({
                                                        gmid,
                                                        etid: sport.etid,
                                                        matchName: match.ename,
                                                        matchDate: dateObj.dt,
                                                        leagueName: league.cname,
                                                      }),
                                                    },
                                                    { replace: true }
                                                  );
                                                  handleMatchClick(gmid);
                                                  dispatch(setIsOpen(false));
                                                }}
                                                className="py-[2px] px-1 text-[12px] leading-[15px] font-normal text-[#1e1e1e] cursor-pointer whitespace-normal break-words flex items-center w-full"
                                              >
                                                <span>{match.ename}</span>
                                                <span className="ml-1.5 font-bold shrink-0 text-[14px]">{isMatchExpanded ? '-' : '+'}</span>
                                              </div>
                                            </div>

                                            {/* Level 5: Markets Container (treedata5) */}
                                            {isMatchExpanded && hasMarkets && (
                                              <div className="relative flex flex-col 3 ml-[6px] pl-[4px] border-l border-[#333333] my-0.5 space-y-[1px]">
                                                {markets.map((market) => (
                                                  <div key={market.mid} className="relative flex items-center">
                                                    <span className="sports-tree-gold-dot" />

                                                    <Link
                                                      to={`/market-analysis?${buildParams({
                                                        gmid,
                                                        etid: sport.etid,
                                                        matchName: match.ename,
                                                        matchDate: dateObj.dt,
                                                        leagueName: league.cname,
                                                      })}`}
                                                      onClick={() => {
                                                        selectMatch({
                                                          etid: sport.etid,
                                                          gmid,
                                                          matchName: match.ename,
                                                          matchDate: dateObj.dt,
                                                          sportName: sport.ename,
                                                          leagueName: league.cname,
                                                        });
                                                        dispatch(setIsOpen(false));
                                                      }}
                                                      className="py-[1.5px] px-1 text-[12px] leading-[15px] font-normal text-[#1e1e1e] cursor-pointer whitespace-normal break-words"
                                                    >
                                                      <span>{market.mname}</span>
                                                    </Link>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
