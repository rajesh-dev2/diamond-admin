import React from 'react';

export type OddsType = 'back' | 'back1' | 'back2' | 'lay' | 'lay1' | 'lay2';

export interface OddsBoxProps {
  type: OddsType;
  odds: string | number;
  volume?: string | number;
  disabled?: boolean;
  /** When true the box keeps its back/lay colour but overlays a lock icon */
  suspended?: boolean;
  /** 'down' = green flash (odds decreased), 'up' = red flash (odds increased) */
  trend?: 'down' | 'up' | null;
  onClick?: () => void;
  className?: string;
}

export const OddsBox: React.FC<OddsBoxProps> = ({
  type,
  odds,
  volume,
  disabled = false,
  suspended = false,
  trend = null,
  onClick,
  className = '',
}) => {
  const isInactive = disabled || suspended;
  // A box is only grey ('no-val') if active but missing odds data
  const isNoVal = !isInactive && (odds === '—' || odds === '' || odds === undefined || odds === null);
  const isClickable = !isNoVal && !isInactive && !!onClick;

  // When inactive/disabled/suspended, do not show data numbers (keep empty / '—')
  const displayOdds = isInactive ? '—' : (odds ?? '—');
  const showVolume = !isInactive && !isNoVal && volume !== undefined && volume !== '';

  const boxClass = [
    'bl-box',
    type,
    isNoVal ? 'no-val' : '',
    suspended ? 'suspended' : '',
    !isNoVal && !isInactive && trend === 'down' ? 'trend-down' : '',
    !isNoVal && !isInactive && trend === 'up' ? 'trend-up' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={boxClass}
      onClick={isClickable ? onClick : undefined}
    >
      <span className="d-block odds">{displayOdds}</span>
      {showVolume && (
        <span className="d-block">{volume}</span>
      )}
    </div>
  );
};

export interface OddsData {
  odds: string | number;
  volume?: string | number;
}

export interface OddsGroupProps {
  backOdds?: (OddsData | null)[];
  layOdds?: (OddsData | null)[];
  disabled?: boolean;
  /** When true, all boxes show lock icon overlay */
  suspended?: boolean;
  onOddsClick?: (type: OddsType, item: OddsData) => void;
  className?: string;
}

export const OddsGroup: React.FC<OddsGroupProps> = ({
  backOdds = [],
  layOdds = [],
  disabled = false,
  suspended = false,
  onOddsClick,
  className = '',
}) => {
  // Ordered types for 3 Back boxes: back2 (light), back1 (mid), back (dark)
  const backTypes: OddsType[] = ['back2', 'back1', 'back'];
  // Ordered types for 3 Lay boxes: lay (dark), lay1 (mid), lay2 (light)
  const layTypes: OddsType[] = ['lay', 'lay1', 'lay2'];

  return (
    <div className={`flex items-center ${className}`.trim()}>
      {backTypes.map((type, idx) => {
        const data = backOdds[idx];
        return (
          <OddsBox
            key={`back-${idx}`}
            type={type}
            odds={data ? data.odds : '—'}
            volume={data ? data.volume : ''}
            disabled={!suspended && (disabled || !data)}
            suspended={suspended && !!data}
            onClick={() => data && onOddsClick && onOddsClick(type, data)}
          />
        );
      })}
      {layTypes.map((type, idx) => {
        const data = layOdds[idx];
        return (
          <OddsBox
            key={`lay-${idx}`}
            type={type}
            odds={data ? data.odds : '—'}
            volume={data ? data.volume : ''}
            disabled={!suspended && (disabled || !data)}
            suspended={suspended && !!data}
            onClick={() => data && onOddsClick && onOddsClick(type, data)}
          />
        );
      })}
    </div>
  );
};

export default OddsBox;
