import { QueryKey } from '@tanstack/react-query';
import { create } from 'zustand';

interface ListQueryKeyState {
  queryKeyOfList: QueryKey | null;
  pageIndexOfInfinteList: number | null;
  setQueryKeyOfList: (queryKey: QueryKey | null) => void;
  setPageIndexOfInfinteList: (pageIndex: number | null) => void;
}

export const useListQueryKeyStore = create<ListQueryKeyState>()(set => ({
  queryKeyOfList: null,
  setQueryKeyOfList: queryKey => set({ queryKeyOfList: queryKey }),
  pageIndexOfInfinteList: null,
  setPageIndexOfInfinteList: pageIndex => set({ pageIndexOfInfinteList: pageIndex }),
}));
