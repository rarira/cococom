import { InsertMemo } from '@cococom/supabase/libs';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefObject } from 'react';
import { create } from 'zustand';

interface MemoEditState {
  memo: InsertMemo;
  bottomSheetRef: RefObject<BottomSheetModal>;
  setMemo: (newMemo: InsertMemo) => void;
  setBottomSheetRef: (bottomSheetRef: RefObject<BottomSheetModal>) => void;
}

export const useMemoEditStore = create<MemoEditState>()(set => ({
  memo: { content: '' },
  bottomSheetRef: { current: null },
  setMemo: memo => set({ memo }),
  setBottomSheetRef: bottomSheetRef => set({ bottomSheetRef }),
}));
