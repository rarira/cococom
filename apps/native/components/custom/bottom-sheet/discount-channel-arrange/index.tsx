import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ForwardedRef, forwardRef, memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/core/bottom-sheet';
import Button from '@/components/core/button';
import Text from '@/components/core/text';
import { useDiscountChannelsArrange } from '@/hooks/settings/useDiscountChannelArrange';

const DiscountChannelArrangeBottomSheet = memo(
  forwardRef(function DiscountChannelArrangeBottomSheet(
    _props,
    ref: ForwardedRef<BottomSheetModal>,
  ) {
    const { styles } = useStyles(stylesheet);
    const { handleUpdate, discountChannels } = useDiscountChannelsArrange();

    const handlePress = useCallback(
      (index: number, direction: 'up' | 'down') => {
        const newDiscountChannels = [...discountChannels];
        const temp = newDiscountChannels[index];
        if (direction === 'up') {
          newDiscountChannels[index] = newDiscountChannels[index - 1];
          newDiscountChannels[index - 1] = temp;
        } else {
          newDiscountChannels[index] = newDiscountChannels[index + 1];
          newDiscountChannels[index + 1] = temp;
        }
        handleUpdate(newDiscountChannels);
      },
      [discountChannels, handleUpdate],
    );

    const discountChannelsArray = useMemo(() => {
      return discountChannels.map((discountChannel, index) => {
        return (
          <View key={discountChannel.value} style={styles.listContainer}>
            <Text style={styles.text}>{discountChannel.text}</Text>
            <View style={styles.buttonContainer}>
              {index !== 0 && (
                <Button
                  onPress={() => handlePress(index, 'up')}
                  // style={({ pressed }) => styles.button({ selected: currentSort === key, pressed })}
                >
                  <Text>Up</Text>
                </Button>
              )}
              {index !== discountChannels.length - 1 && (
                <Button
                  onPress={() => handlePress(index, 'down')}
                  // style={({ pressed }) => styles.button({ selected: currentSort === key, pressed })}
                >
                  <Text>Down</Text>
                </Button>
              )}
            </View>
          </View>
        );
      });
    }, [discountChannels, handlePress, styles]);

    return (
      <BottomSheet ref={ref} index={1} title="채널 검색 순서 변경">
        <View style={styles.container}>{discountChannelsArray}</View>
      </BottomSheet>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: { flexDirection: 'column', gap: theme.spacing.sm, alignItems: 'center' },
  listContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.typography,
  },
}));

export default DiscountChannelArrangeBottomSheet;
