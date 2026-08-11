export interface SportMarket {
  id: string;
  name: string;
}

export interface SportEvent {
  id: string;
  name: string;
  isLive?: boolean;
  startTime?: string;
  matchedAmount?: number;
  markets?: SportMarket[];
}

export interface SportDate {
  id: string;
  date: string;
  events?: SportEvent[];
}

export interface SportLeague {
  id: string;
  name: string;
  dates?: SportDate[];
  events?: SportEvent[];
}

export interface SportNode {
  id: string;
  name: string;
  iconName?: string;
  count?: number;
  isLive?: boolean;
  leagues?: SportLeague[];
}

