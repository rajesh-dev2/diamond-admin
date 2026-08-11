import React from 'react';
import './style.css';

export interface TabItem {
  id: string;
  label: string;
}

export interface NavTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const NavTabs: React.FC<NavTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`common-navtabs-wrapper ${className}`}>
      <ul className="common-navtabs-list">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`common-navtabs-btn ${isActive ? 'common-navtabs-btn-active' : ''}`}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavTabs;
