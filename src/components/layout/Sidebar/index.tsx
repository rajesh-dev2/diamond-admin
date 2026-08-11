import React from 'react';
import { SportsTree } from '@/components/sports/SportsTree';
import { useAppSelector } from '@/store/hooks';
import './style.css';

export function Sidebar() {
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  if (!isOpen) return null;

  return (
    <aside className="sidebar-aside">
      <SportsTree />
    </aside>
  );
}
