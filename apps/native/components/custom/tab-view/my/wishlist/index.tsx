import { memo, useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Checkbox from '@/components/core/checkbox';
import Text from '@/components/core/text';
import SortBottomSheet from '@/components/custom/bottom-sheet/sort';
import DiscountChannelRotateButton from '@/components/custom/button/discount-channel-rotate';
import HeaderRightButton from '@/components/custom/button/header/right';
import SearchOptionCheckbox from '@/components/custom/checkbox/search-option';
import { DiscountChannels } from '@/constants';
import { useDiscountRotateButton } from '@/hooks/discount/useDiscountRotateButton';
import { useWishlists } from '@/hooks/wishlist/useWishlists';
import { useWishlistSort } from '@/hooks/wishlist/useWishlistSort';
import { SearchItemsOptions } from '@/libs/search';
import { WISHLIST_SORT_OPTIONS } from '@/libs/sort';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const MyWishlistTabView = memo(function MyWishlistTabView() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles, theme } = useStyles(stylesheet);

  const { sort, handleSortChange, sortOption } = useWishlistSort(WISHLIST_SORT_OPTIONS, _sort =>
    bottomSheetModalRef.current?.dismiss(),
  );

  const { handlePress: handleChannelPress, option: channelOption } =
    useDiscountRotateButton<DiscountChannels>();

  const [options, setOptions] = useState<string[]>([]);

  const handlePress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const isOnSale = options.includes('on_sale');

  const { data, totalResults } = useWishlists({
    channel: channelOption.value,
    sortOption,
    isOnSale,
  });

  return (
    <>
      <View style={styles.headerRowContainer}>
        {totalResults ? (
          <Text style={styles.totalResultsText}>{`총 ${totalResults} 개`}</Text>
        ) : (
          <View />
        )}
        <View style={styles.headerRightContainer}>
          <Checkbox.Group value={options} onChange={setOptions}>
            <SearchOptionCheckbox
              option="on_sale"
              value={{
                label: '할인 중인 상품만',
                iconColor: 'white',
              }}
              indicatorStyle={styles.checkboxOnSaleIndicator}
            />
          </Checkbox.Group>
          <HeaderRightButton
            iconProps={{ font: { type: 'MaterialIcon', name: 'sort' } }}
            onPress={handlePress}
          />
          <DiscountChannelRotateButton onPress={handleChannelPress} channelOption={channelOption} />
        </View>
      </View>
      {/* <AlltimeRankingList
        sortOption={sortOption}
        contentContainerStyle={styles.container}
        channel={channelOption.value}
      /> */}
      <SortBottomSheet
        sortOptions={WISHLIST_SORT_OPTIONS}
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  headerRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  checkboxOnSaleIndicator: (checked: boolean) => ({
    backgroundColor: checked ? SearchItemsOptions(theme)['on_sale'].indicatorColor : 'transparent',
    borderColor: checked
      ? SearchItemsOptions(theme)['on_sale'].indicatorColor
      : theme.colors.typography,
  }),
  totalResultsText: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
  },
}));

export default MyWishlistTabView;
