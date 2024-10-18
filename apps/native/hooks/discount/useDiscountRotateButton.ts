import { useCallback, useState } from 'react';

import { useDiscountChannels } from '@/store/discount-channels';

export type RotateButtonOption<T> = {
  text: string;
  fullText?: string;
  value: T;
};

export function useDiscountRotateButton<T>() {
  const discountChannels = useDiscountChannels(state => state.discountChannels);

  const [option, setOption] = useState(0);

  const handlePress = useCallback(() => {
    setOption(prev => {
      if (prev + 1 >= discountChannels.length) {
        return 0;
      }
      return prev + 1;
    });
  }, [discountChannels]);

  return { option: discountChannels[option], handlePress };
}
