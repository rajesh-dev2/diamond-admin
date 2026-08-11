import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  isOpen: boolean;
  expandedNodes: Record<string, boolean>;
  selectedEventId: string | null;
}

const initialState: SidebarState = {
  isOpen: false,
  expandedNodes: {},
  selectedEventId: null,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    toggleNodeExpand: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      state.expandedNodes[nodeId] = !state.expandedNodes[nodeId];
    },
    collapseAll: (state) => {
      state.expandedNodes = {};
    },
    setSelectedEvent: (state, action: PayloadAction<string | null>) => {
      state.selectedEventId = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setIsOpen,
  toggleNodeExpand,
  collapseAll,
  setSelectedEvent,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
