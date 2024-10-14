import { JoinedItems } from '@cococom/supabase/types';
import * as WebBrowser from 'expo-web-browser';
import { memo, useCallback } from 'react';
import { useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/core/button/icon';

interface OpenWebButtonProps {
  item: JoinedItems;
  iconProps?: Partial<Pick<IconButtonProps['iconProps'], 'size' | 'color'>>;
}

const OpenWebButton = memo(function OpenWebButton({ item, iconProps }: OpenWebButtonProps) {
  const { theme } = useStyles();

  const handlePress = useCallback(async () => {
    if (item && process.env.EXPO_PUBLIC_ONLINE_HOST) {
      console.log(process.env.EXPO_PUBLIC_ONLINE_HOST + item.online_url);
      const result = await WebBrowser.openBrowserAsync(
        process.env.EXPO_PUBLIC_ONLINE_HOST + item.online_url,
      );
      console.log('opneWebButton result', result);
    }
  }, [item]);

  return (
    <IconButton
      iconProps={{
        font: { type: 'Ionicon', name: 'globe-outline' },
        size: theme.fontSize.lg,
        color: theme.colors.typography,
        ...iconProps,
      }}
      onPress={handlePress}
    />
  );
});

export default OpenWebButton;
