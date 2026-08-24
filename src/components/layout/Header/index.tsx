import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/sidebarSlice';
import { logout, updateProfile } from '@/store/slices/authSlice';
import { useGetMeQuery } from '@/store/slices/apiSlice';
import MultiSelect from '@/components/common/MultiSelect';
import './style.css';

const ME_POLLING_INTERVAL_MS = 5000;

export function Header() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: me } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: ME_POLLING_INTERVAL_MS,
  });

  useEffect(() => {
    if (!me) return;
    dispatch(
      updateProfile({
        balance: me.balance,
        exposure: me.exposure,
        creditLimit: me.creditLimit,
      })
    );
  }, [me, dispatch]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('All Client');
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveMarketItems = [
    { label: 'Premium Casino', path: `${ROUTES.LIVE_MARKET}?game=premium-casino` },
    { label: 'Tembo Casino', path: `${ROUTES.LIVE_MARKET}?game=tembo-casino` },
    { label: 'Vip Casino', path: `${ROUTES.LIVE_MARKET}?game=vip-casino` },
    { label: 'Lucky 6', path: `${ROUTES.LIVE_MARKET}?game=lucky-6` },
    { label: 'Mogambo', path: `${ROUTES.LIVE_MARKET}?game=mogambo` },
    { label: 'Unique Teenpatti', path: `${ROUTES.LIVE_MARKET}?game=unique-teenpatti` },
    { label: 'Roulette', path: `${ROUTES.LIVE_MARKET}?game=roulette` },
    { label: 'Super Over2', path: `${ROUTES.LIVE_MARKET}?game=super-over2` },
    { label: 'Lucky15', path: `${ROUTES.LIVE_MARKET}?game=lucky15` },
    { label: 'Goal', path: `${ROUTES.LIVE_MARKET}?game=goal` },
    { label: 'Goal2', path: `${ROUTES.LIVE_MARKET}?game=goal2` },
    { label: 'Binary', path: `${ROUTES.LIVE_MARKET}?game=binary` },
    { label: 'Race 20-20', path: `${ROUTES.LIVE_MARKET}?game=race20` },
    { label: 'Queen', path: `${ROUTES.LIVE_MARKET}?game=queen` },
    { label: 'Baccarat', path: `${ROUTES.LIVE_MARKET}?game=baccarat` },
    { label: 'Sport Casino', path: `${ROUTES.LIVE_MARKET}?game=sportscasino` },
    { label: 'Casino War', path: `${ROUTES.LIVE_MARKET}?game=war` },
    { label: 'Worli', path: `${ROUTES.LIVE_MARKET}?game=worli` },
    { label: '3 Card Judgement', path: `${ROUTES.LIVE_MARKET}?game=3cardj` },
    { label: '32 Card Casino', path: `${ROUTES.LIVE_MARKET}?game=cards32` },
    { label: 'Live Teenpatti', path: `${ROUTES.LIVE_MARKET}?game=liveteenpatti` },
    { label: 'Teenpatti 2.0', path: `${ROUTES.LIVE_MARKET}?game=teenpatti2` },
    { label: 'Live Poker', path: `${ROUTES.LIVE_MARKET}?game=livepoker` },
    { label: 'Andar Bahar', path: `${ROUTES.LIVE_MARKET}?game=andarbahar` },
    { label: 'Lucky 7', path: `${ROUTES.LIVE_MARKET}?game=lucky7` },
    { label: 'Dragon Tiger', path: `${ROUTES.LIVE_MARKET}?game=dragontiger` },
    { label: 'Bollywood Casino', path: `${ROUTES.LIVE_MARKET}?game=bollywood-casino` },
    { label: 'Others', path: `${ROUTES.LIVE_MARKET}?game=other-casino` },
  ];

  const liveVirtualMarketItems = [
    { label: '20-20 DTL', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=20-20-dtl` },
    { label: 'Amar Akbar Anthony', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=amar-akbar-anthony` },
    { label: 'Muflis Teenpatti', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=muflis-teenpatti` },
    { label: '1 Day Teenpatti', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=1-day-teenpatti` },
    { label: '1 Day Dragon Tiger', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=1-day-dragon-tiger` },
    { label: 'Lucky 7', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=lucky-7` },
    { label: 'Bollywood Casino', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=bollywood-casino` },
    { label: '20-20 Teenpatti', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=20-20-teenpatti` },
    { label: 'Trio', path: `${ROUTES.LIVE_VIRTUAL_MARKET}?game=trio` },
  ];

  const reportsItems = [
    { label: 'Account Statement', path: `${ROUTES.REPORTS}/accountstatement` },
    { label: 'Current Bets', path: `${ROUTES.REPORTS}/currentbets` },
    { label: 'General Report', path: `${ROUTES.REPORTS}/generalreport` },
    { label: 'Game Report', path: `${ROUTES.REPORTS}/gamereport` },
    { label: 'Casino Report', path: `${ROUTES.REPORTS}/livecasinoreport` },
    { label: 'Profit And Loss', path: `${ROUTES.REPORTS}/profitloss` },
    { label: 'Casino Result Report', path: `${ROUTES.REPORTS}/casinoresult` },
    { label: 'General Lock', path: `${ROUTES.REPORTS}/userlock` },
    { label: 'User Register Detail', path: `${ROUTES.REPORTS}/userregisterdetail` },
    { label: 'Total Profit Loss', path: `${ROUTES.REPORTS}/totalprofitloss` },
    { label: 'User Win Loss', path: `${ROUTES.REPORTS}/userwinloss` },
  ];

  const userMenuItems = [
    { label: 'Secure Auth Verification', action: () => { } },
    { label: 'Change Password', action: () => { } },
    { label: 'Logout', action: () => dispatch(logout()) },
  ];

  return (
    <header className="site-header">
      {/* Left Section: Logo, Hamburger & Nav Links */}
      <div className="flex items-center gap-2" ref={navRef}>
        {/* Logo Image */}
        <Link to={ROUTES.ACCOUNT_LIST} className="flex items-center shrink-0 pr-1 h-[52px]">
          <img
            src="/assets/logo/logo.png"
            alt="RICE EXCH"
            className="max-h-[40px] h-auto w-auto max-w-full object-contain"
          />
        </Link>

        {/* Sidebar Hamburger Toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1 text-white hover:bg-[#2A2A2A] rounded transition-colors cursor-pointer mr-1 hover:bg-transparent"
          title="Toggle Sports Menu"
        >
          <i className="fa fa-fw fa-bars"></i>
        </button>

        {/* Top Navigation Bar */}
        <nav className="flex items-center gap-1 text-xs font-bold">
          <Link
            to={ROUTES.CLIENTS}
            className={`site-header-nav-link ${pathname === ROUTES.CLIENTS || pathname.startsWith('/admin/users') || pathname.startsWith('/clients') || pathname.startsWith('/users')
              ? 'bg-[#2A2A2A]'
              : ''
              }`}
          >
            List of Clients
          </Link>

          <Link
            to={ROUTES.ASSIGN_AGENT}
            className={`site-header-nav-link ${pathname === ROUTES.ASSIGN_AGENT ? 'bg-[#2A2A2A]' : ''
              }`}
          >
            Assign Agent
          </Link>

          <Link
            to={ROUTES.MARKET_ANALYSIS}
            className={`site-header-nav-link ${pathname === ROUTES.MARKET_ANALYSIS ? 'bg-[#2A2A2A]' : ''
              }`}
          >
            Market Analysis
          </Link>

          {/* Live Market Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('live')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'live' ? null : 'live')}
              className={`site-header-dropdown-btn ${activeDropdown === 'live' ? 'bg-[#2A2A2A]' : 'hover:bg-[#2A2A2A]'
                }`}
            >
              <span>Live Market</span>
              <i className="fa fa-caret-down text-[10px] ml-0.5"></i>
            </button>

            {activeDropdown === 'live' && (
              <div className="site-header-dropdown-menu w-48">
                {liveMarketItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setActiveDropdown(null)}
                    className="site-header-dropdown-item"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Live Virtual Market Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('virtual')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'virtual' ? null : 'virtual')}
              className={`site-header-dropdown-btn ${activeDropdown === 'virtual' ? 'bg-[#2A2A2A]' : 'hover:bg-[#2A2A2A]'
                }`}
            >
              <span>Live Virtual Market</span>
              <i className="fa fa-caret-down text-[10px] ml-0.5"></i>
            </button>

            {activeDropdown === 'virtual' && (
              <div className="site-header-dropdown-menu w-48">
                {liveVirtualMarketItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setActiveDropdown(null)}
                    className="site-header-dropdown-item"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reports Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('reports')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'reports' ? null : 'reports')}
              className={`site-header-dropdown-btn ${activeDropdown === 'reports' ? 'bg-[#2A2A2A]' : 'hover:bg-[#2A2A2A]'
                }`}
            >
              <span>Reports</span>
              <i className="fa fa-caret-down text-[10px] ml-0.5"></i>
            </button>

            {activeDropdown === 'reports' && (
              <div className="site-header-dropdown-menu w-56">
                {reportsItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setActiveDropdown(null)}
                    className="site-header-dropdown-item"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to={ROUTES.SETTINGS}
            className={`site-header-nav-link ${pathname === ROUTES.SETTINGS ? 'bg-[#2A2A2A]' : ''
              }`}
          >
            Multi Login
          </Link>
        </nav>
      </div>

      {/* Right Section: pwdemm1 dropdown, Combined Site Search Box */}
      <div className="flex items-center gap-2">
        {/* User profile dropdown (pwdemm1) */}
        <div className="relative py-2" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="text-[14px] leading-[15px] font-bold text-white flex items-center gap-1 hover:text-amber-100 cursor-pointer whitespace-nowrap"
          >
            <span>{user?.name || 'pwdemm1'}</span>
            {typeof user?.balance === 'number' && (
              <span className="text-[12px] font-normal opacity-90">
                ({user.balance.toLocaleString()})
              </span>
            )}
            <i className="fa fa-caret-down text-[10px]"></i>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-0 w-48 bg-[#BE8220] shadow-xl z-50 py-0 flex flex-col border-t border-amber-600/30">
              {userMenuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserDropdownOpen(false);
                    item.action();
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white text-left hover:bg-[#333333] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Site Searchbox: Vue Multiselect structure */}
        <MultiSelect
          value={searchValue}
          onChange={setSearchValue}
          placeholder="All Client"
          icon={<i className="fas fa-search-plus text-[24px]"></i>}
        />
      </div>
    </header>
  );
}
