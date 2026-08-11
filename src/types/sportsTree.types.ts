export interface TreeSportItem {
  etid: number | string;
  ename: string;
}

export interface TreeLeagueItem {
  cid: string | number;
  cname: string;
}

export interface TreeDateItem {
  dt: string;
}

export interface TreeMatchItem {
  eid: string | number;
  ename: string;
  gmid?: string | number;
  gameId?: string | number;
  markets?: TreeMarketItem[];
}

export interface TreeMarketItem {
  mid: string | number;
  mname: string;
}

export interface TreeData2Req {
  etid: number | string;
}

export interface TreeData3Req {
  cid: string | number;
}

export interface TreeData4Req {
  cid: string | number;
  dt: string;
}

export interface TreeData5Req {
  gmid: string | number;
}
