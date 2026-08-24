import React, { useState } from 'react';

export interface BetTableButton {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface BetTableProps {
  title: string;
  buttons?: BetTableButton[];
  marketId?: string;
  marketType?: 'market-4' | 'market-6' | 'market-10';
  status?: string;
  remark?: string;
  children: React.ReactNode;
  className?: string;
}

export const BetTable: React.FC<BetTableProps> = ({
  title,
  buttons = [{ label: 'Bet Lock' }],
  marketId = 'market0',
  marketType = 'market-6',
  status = 'OPEN',
  remark,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${marketType} ${className}`.trim()}>
      <div className="bet-table">
        <div
          className="bet-table-header cursor-pointer select-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="nation-name">
            <span title={title}>{title}</span>
          </div>
          {buttons && buttons.length > 0 && (
            <div className="float-right" onClick={(e) => e.stopPropagation()}>
              {buttons.map((btn, idx) => (
                <a
                  key={idx}
                  href="javascript:void(0)"
                  className={`btn btn-back ${btn.disabled ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={btn.onClick}
                >
                  {btn.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className={`bet-table-body-wrapper ${isOpen ? 'expanded' : 'collapsed'}`}>
          <div className="bet-table-body-inner">
            <div id={marketId} data-title={status} className="bet-table-body">
              {children}
            </div>
          </div>
        </div>
      </div>
      {remark && <small className="remark">{remark}</small>}
    </div>
  );
};

export default BetTable;
