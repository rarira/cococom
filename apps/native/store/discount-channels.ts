import { createWithEqualityFn as create } from 'zustand/traditional';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DiscountChannels, DiscountRotateButtonOptions } from '@/constants';
import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';
import { STORAGE_KEYS, zustandStorage } from '@/libs/mmkv';

interface DiscountChannelState {
  discountChannels: RotateButtonOption<DiscountChannels>[];
  setDiscountChannels: (discountChannels: RotateButtonOption<DiscountChannels>[]) => void;
}

export const useDiscountChannels = create(
  persist<DiscountChannelState>(
    set => ({
      discountChannels: DiscountRotateButtonOptions,
      setDiscountChannels: discountChannels => set({ discountChannels }),
    }),
    {
      name: STORAGE_KEYS.STORE.DISCOUNT_CHANNELS,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
