import { useCallback } from 'react';

import { DiscountChannels } from '@/constants';
import { useDiscountChannels } from '@/store/discount-channels';

import { RotateButtonOption } from '../discount/useDiscountRotateButton';

export function useDiscountChannelsArrange() {
  const { discountChannels, setDiscountChannels } = useDiscountChannels();

  const handleUpdate = useCallback(
    (newChannels: RotateButtonOption<DiscountChannels>[]) => {
      setDiscountChannels(newChannels);
    },
    [setDiscountChannels],
  );

  return {
    discountChannels,
    handleUpdate,
  };
}
