import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOP_NAV_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function Topbar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="hidden w-full bg-[#1A1A1A] text-white px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-gray-800">
      {TOP_NAV_ROUTES.map((route) => {
        const isActive = pathname === route.path;
        return (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              'px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5',
              isActive
                ? 'bg-[#C98A1B] text-white font-bold'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
          >
            <span>{route.label}</span>
            {route.badge && (
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-red-600 text-white rounded">
                {route.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
