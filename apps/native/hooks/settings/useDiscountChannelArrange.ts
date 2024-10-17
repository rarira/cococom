import { useCallback, useEffect } from 'react';

import { DiscountChannels } from '@/constants';
import { storage, STORAGE_KEYS } from '@/libs/mmkv';
import { useDiscountChannels } from '@/store/discount-channels';

import { RotateButtonOption } from '../discount/useDiscountRotateButton';

export function useDiscountChannelsArrange() {
  const { discountChannels, setDiscountChannels } = useDiscountChannels();

  useEffect(() => {
    const stored = storage.getString(STORAGE_KEYS.DISCOUNT_CHANNELS);
    if (stored) {
      setDiscountChannels(JSON.parse(stored));
    }
  }, [setDiscountChannels]);

  const handleUpdate = useCallback(
    (newChannels: RotateButtonOption<DiscountChannels>[]) => {
      setDiscountChannels(newChannels);
      storage.set(STORAGE_KEYS.DISCOUNT_CHANNELS, JSON.stringify(newChannels));
    },
    [setDiscountChannels],
  );

  return {
    discountChannels,
    handleUpdate,
  };
}
