'use client';

import React from 'react';
import { SportNode } from '@/types/sports.types';

export interface SportItemProps {
  sport: SportNode;
  isCollapsed?: boolean;
}

export function SportItem({ sport }: SportItemProps) {
  return (
    <div className="py-1 px-3 text-xs font-bold text-[#222222]">
      {sport.name}
    </div>
  );
}
