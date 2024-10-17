import { create } from 'zustand';

import { DiscountChannels, DiscountRotateButtonOptions } from '@/constants';
import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';

interface DiscountChannelState {
  discountChannels: RotateButtonOption<DiscountChannels>[];
  setDiscountChannels: (discountChannels: RotateButtonOption<DiscountChannels>[]) => void;
}

export const useDiscountChannels = create<DiscountChannelState>()(set => ({
  discountChannels: DiscountRotateButtonOptions,
  setDiscountChannels: discountChannels => set({ discountChannels }),
}));
