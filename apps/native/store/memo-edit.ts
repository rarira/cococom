import { InsertMemo } from '@cococom/supabase/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefObject } from 'react';
import { createWithEqualityFn as create } from 'zustand/traditional';

interface MemoEditState {
  memo: InsertMemo;
  bottomSheetRef: RefObject<BottomSheetModal>;
  isEditMode: boolean;
  setMemo: (newMemo: InsertMemo) => void;
  setBottomSheetRef: (bottomSheetRef: RefObject<BottomSheetModal>) => void;
  setIsEditMode: (isEditMode: boolean) => void;
}

export const useMemoEditStore = create<MemoEditState>()(set => ({
  memo: { content: '' },
  isEditMode: false,
  bottomSheetRef: { current: null },
  setMemo: memo => set({ memo }),
  setBottomSheetRef: bottomSheetRef => set({ bottomSheetRef }),
  setIsEditMode: isEditMode => set({ isEditMode }),
}));
