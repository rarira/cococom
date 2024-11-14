import { createWithEqualityFn as create } from 'zustand/traditional';

import { DiscountChannels } from '@/constants';
import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';

interface DiscountChannelState {
  discountChannels: RotateButtonOption<DiscountChannels>[];
  setDiscountChannels: (discountChannels: RotateButtonOption<DiscountChannels>[]) => void;
}

export const useDiscountChannels = create<DiscountChannelState>()(set => ({
  discountChannels: [],
  setDiscountChannels: discountChannels => set({ discountChannels }),
}));
