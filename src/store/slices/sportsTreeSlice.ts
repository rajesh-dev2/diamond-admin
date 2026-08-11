import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SportsTreeService } from '@/services/sportsTree.service';
import {
  TreeSportItem,
  TreeLeagueItem,
  TreeDateItem,
  TreeMatchItem,
  TreeMarketItem,
} from '@/types/sportsTree.types';

interface SportsTreeState {
  sports: TreeSportItem[];
  leaguesMap: Record<string, TreeLeagueItem[]>;
  datesMap: Record<string, TreeDateItem[]>;
  matchesMap: Record<string, TreeMatchItem[]>;
  marketsMap: Record<string, TreeMarketItem[]>;
  loadingNodes: Record<string, boolean>;
  isInitialLoading: boolean;
  selectedEtid?: number | string;
  selectedGmid?: number | string;
  selectedMatchName?: string;
  selectedMatchDate?: string;
  selectedSportName?: string;
  selectedLeagueName?: string;
}

const initialState: SportsTreeState = {
  sports: [],
  leaguesMap: {},
  datesMap: {},
  matchesMap: {},
  marketsMap: {},
  loadingNodes: {},
  isInitialLoading: false,
  selectedEtid: 1,
  selectedGmid: 542267677,
};

// Async Thunk: Fetch Root Sports (treedata1)
export const fetchSportsThunk = createAsyncThunk(
  'sportsTree/fetchSports',
  async () => {
    const data = await SportsTreeService.getSports();
    return data;
  }
);

// Async Thunk: Fetch Leagues for Sport (treedata2)
export const fetchLeaguesThunk = createAsyncThunk(
  'sportsTree/fetchLeagues',
  async (etid: number | string) => {
    const leagues = await SportsTreeService.getLeagues(etid);
    return { etid: String(etid), leagues };
  }
);

// Async Thunk: Fetch Dates for Competition (treedata3)
export const fetchDatesThunk = createAsyncThunk(
  'sportsTree/fetchDates',
  async (cid: string | number) => {
    const dates = await SportsTreeService.getDates(cid);
    return { cid: String(cid), dates };
  }
);

// Async Thunk: Fetch Matches for Date (treedata4)
export const fetchMatchesThunk = createAsyncThunk(
  'sportsTree/fetchMatches',
  async ({ cid, dt }: { cid: string | number; dt: string }) => {
    const matches = await SportsTreeService.getMatches(cid, dt);
    return { matchKey: `${cid}_${dt}`, matches };
  }
);

// Async Thunk: Fetch Markets for Match (treedata5)
export const fetchMarketsThunk = createAsyncThunk(
  'sportsTree/fetchMarkets',
  async (gmid: string | number) => {
    const markets = await SportsTreeService.getMarkets(gmid);
    return { gmid: String(gmid), markets };
  }
);

export const sportsTreeSlice = createSlice({
  name: 'sportsTree',
  initialState,
  reducers: {
    setNodeLoading: (
      state,
      action: PayloadAction<{ nodeKey: string; isLoading: boolean }>
    ) => {
      state.loadingNodes[action.payload.nodeKey] = action.payload.isLoading;
    },
    setSelectedMatch: (
      state,
      action: PayloadAction<{
        etid: number | string;
        gmid: number | string;
        matchName?: string;
        matchDate?: string;
        sportName?: string;
        leagueName?: string;
      }>
    ) => {
      state.selectedEtid = action.payload.etid;
      state.selectedGmid = action.payload.gmid;
      if (action.payload.matchName) state.selectedMatchName = action.payload.matchName;
      if (action.payload.matchDate) state.selectedMatchDate = action.payload.matchDate;
      if (action.payload.sportName) state.selectedSportName = action.payload.sportName;
      if (action.payload.leagueName) state.selectedLeagueName = action.payload.leagueName;
    },
  },
  extraReducers: (builder) => {
    // Root Sports
    builder.addCase(fetchSportsThunk.pending, (state) => {
      state.isInitialLoading = true;
    });
    builder.addCase(fetchSportsThunk.fulfilled, (state, action) => {
      state.sports = action.payload;
      state.isInitialLoading = false;
    });
    builder.addCase(fetchSportsThunk.rejected, (state) => {
      state.isInitialLoading = false;
    });

    // Leagues
    builder.addCase(fetchLeaguesThunk.pending, (state, action) => {
      state.loadingNodes[`sport-${action.meta.arg}`] = true;
    });
    builder.addCase(fetchLeaguesThunk.fulfilled, (state, action) => {
      const { etid, leagues } = action.payload;
      state.leaguesMap[etid] = leagues;
      state.loadingNodes[`sport-${etid}`] = false;
    });
    builder.addCase(fetchLeaguesThunk.rejected, (state, action) => {
      state.loadingNodes[`sport-${action.meta.arg}`] = false;
    });

    // Dates
    builder.addCase(fetchDatesThunk.pending, (state, action) => {
      state.loadingNodes[`league-${action.meta.arg}`] = true;
    });
    builder.addCase(fetchDatesThunk.fulfilled, (state, action) => {
      const { cid, dates } = action.payload;
      state.datesMap[cid] = dates;
      state.loadingNodes[`league-${cid}`] = false;
    });
    builder.addCase(fetchDatesThunk.rejected, (state, action) => {
      state.loadingNodes[`league-${action.meta.arg}`] = false;
    });

    // Matches
    builder.addCase(fetchMatchesThunk.pending, (state, action) => {
      const { cid, dt } = action.meta.arg;
      state.loadingNodes[`date-${cid}-${dt}`] = true;
    });
    builder.addCase(fetchMatchesThunk.fulfilled, (state, action) => {
      const { matchKey, matches } = action.payload;
      const { cid, dt } = action.meta.arg;
      state.matchesMap[matchKey] = matches;
      state.loadingNodes[`date-${cid}-${dt}`] = false;
    });
    builder.addCase(fetchMatchesThunk.rejected, (state, action) => {
      const { cid, dt } = action.meta.arg;
      state.loadingNodes[`date-${cid}-${dt}`] = false;
    });

    // Markets
    builder.addCase(fetchMarketsThunk.pending, (state, action) => {
      state.loadingNodes[`match-${action.meta.arg}`] = true;
    });
    builder.addCase(fetchMarketsThunk.fulfilled, (state, action) => {
      const { gmid, markets } = action.payload;
      state.marketsMap[gmid] = markets;
      state.loadingNodes[`match-${gmid}`] = false;
    });
    builder.addCase(fetchMarketsThunk.rejected, (state, action) => {
      state.loadingNodes[`match-${action.meta.arg}`] = false;
    });
  },
});

export const { setNodeLoading, setSelectedMatch } = sportsTreeSlice.actions;
export default sportsTreeSlice.reducer;
