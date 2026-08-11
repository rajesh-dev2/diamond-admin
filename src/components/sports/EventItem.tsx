'use client';

import React from 'react';
import { SportEvent } from '@/types/sports.types';

export interface EventItemProps {
  event: SportEvent;
  isCollapsed?: boolean;
}

export function EventItem({ event }: EventItemProps) {
  return (
    <div className="py-1 px-3 text-xs font-semibold text-[#333333]">
      {event.name}
    </div>
  );
}
