import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  toggleSidebar as toggleSidebarAction,
  setIsOpen as setIsOpenAction,
  toggleNodeExpand as toggleNodeExpandAction,
  collapseAll as collapseAllAction,
  setSelectedEvent as setSelectedEventAction,
} from '@/store/slices/sidebarSlice';

export interface SidebarStoreState {
  isOpen: boolean;
  expandedNodes: Record<string, boolean>;
  selectedEventId: string | null;
  toggleSidebar: () => void;
  setIsOpen: (open: boolean) => void;
  toggleNodeExpand: (nodeId: string) => void;
  collapseAll: () => void;
  setSelectedEvent: (eventId: string | null) => void;
}

export function useSidebarStore(): SidebarStoreState;
export function useSidebarStore<T>(selector: (state: SidebarStoreState) => T): T;
export function useSidebarStore<T>(selector?: (state: SidebarStoreState) => T): T | SidebarStoreState {
  const sidebar = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();

  const storeObj: SidebarStoreState = {
    isOpen: sidebar.isOpen,
    expandedNodes: sidebar.expandedNodes,
    selectedEventId: sidebar.selectedEventId,
    toggleSidebar: () => dispatch(toggleSidebarAction()),
    setIsOpen: (open: boolean) => dispatch(setIsOpenAction(open)),
    toggleNodeExpand: (nodeId: string) => dispatch(toggleNodeExpandAction(nodeId)),
    collapseAll: () => dispatch(collapseAllAction()),
    setSelectedEvent: (eventId: string | null) => dispatch(setSelectedEventAction(eventId)),
  };

  if (selector) {
    return selector(storeObj);
  }
  return storeObj;
}

useSidebarStore.getState = (): SidebarStoreState => {
  const state = store.getState().sidebar;
  return {
    isOpen: state.isOpen,
    expandedNodes: state.expandedNodes,
    selectedEventId: state.selectedEventId,
    toggleSidebar: () => store.dispatch(toggleSidebarAction()),
    setIsOpen: (open: boolean) => store.dispatch(setIsOpenAction(open)),
    toggleNodeExpand: (nodeId: string) => store.dispatch(toggleNodeExpandAction(nodeId)),
    collapseAll: () => store.dispatch(collapseAllAction()),
    setSelectedEvent: (eventId: string | null) => store.dispatch(setSelectedEventAction(eventId)),
  };
};
