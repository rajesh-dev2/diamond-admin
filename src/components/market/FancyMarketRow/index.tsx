import React from 'react';
import { OddsBox } from '../OddsBox';

export interface FancyMarketRowProps {
  name: string;
  layOdds?: string | number;
  layVol?: string | number;
  backOdds?: string | number;
  backVol?: string | number;
  min?: string | number;
  max?: string | number;
  isSuspended?: boolean;
  hasRemark?: boolean;
  remarkText?: string;
  position?: number | string;
}

export const FancyMarketRow: React.FC<FancyMarketRowProps> = ({
  name,
  layOdds,
  layVol,
  backOdds,
  backVol,
  min = '100',
  max = '25K',
  isSuspended = false,
  hasRemark = false,
  remarkText = '**Hundred Mens and Womens Cup Winner and Special Bets Started in our Exchange*',
  position = 0,
}) => {
  return (
    <React.Fragment>
      <div className="fancy-tripple">
        <div className="bet-table-row">
          <div className="nation-name d-none-mobile">
            <p>{name}</p>
            <p className="mb-0 position-red">{position}</p>
          </div>
          {layOdds !== undefined && (
            <OddsBox
              type="lay"
              odds={layOdds}
              volume={layVol}
              disabled={!isSuspended && layOdds === '—'}
              suspended={isSuspended}
            />
          )}
          {backOdds !== undefined && (
            <OddsBox
              type="back"
              odds={backOdds}
              volume={backVol}
              disabled={!isSuspended && backOdds === '—'}
              suspended={isSuspended}
            />
          )}
          <div className="fancy-min-max">
            <span>Min:{min}</span>
            <span>Max:{max}</span>
          </div>
        </div>
      </div>
      {hasRemark && <div className="sec-remark">{remarkText}</div>}
    </React.Fragment>
  );
};

export default FancyMarketRow;
