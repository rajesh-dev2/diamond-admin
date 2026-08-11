'use client';

import React from 'react';
import { SportLeague } from '@/types/sports.types';

export interface LeagueItemProps {
  league: SportLeague;
  isCollapsed?: boolean;
}

export function LeagueItem({ league }: LeagueItemProps) {
  return (
    <div className="py-1 px-3 text-xs font-semibold text-[#333333]">
      {league.name}
    </div>
  );
}
