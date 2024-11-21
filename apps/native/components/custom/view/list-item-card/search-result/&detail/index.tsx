import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import Text from '@/components/core/text';
import ListItemWishlistIconButton from '@/components/custom/button/list-item-wishlist-icon';
import InfoIconText from '@/components/custom/text/info-icon';
import DiscountRecordView from '@/components/custom/view/discount-record';
import { ITEM_DETAILS_MAX_COUNT, PortalHostNames } from '@/constants';
import { getDiscountTypeFromResult } from '@/libs/item';
import { InfiniteSearchResultData, SearchResultToRender } from '@/libs/search';
import Util from '@/libs/util';
import { useUserStore } from '@/store/user';

interface SearchResultListItemCardDetailViewProps {
  item: SearchResultToRender[number];
}

function SearchResultListItemCardDetailView({ item }: SearchResultListItemCardDetailViewProps) {
  const { styles, theme } = useStyles(stylesheets);

  const user = useUserStore(store => store.user);

  const discountType = getDiscountTypeFromResult(item);

  return (
    <View style={styles.container}>
      <Text style={styles.itemNameText} numberOfLines={3}>
        {item.itemName}
      </Text>
      <DiscountRecordView
        item={item}
        discountType={discountType}
        style={styles.discountRecordContainer}
      />
      <View style={styles.footer}>
        {item.isOnSaleNow ? <Chip text="할인 중" /> : <View />}
        {/* <Text style={styles.textStyle}>리뷰: 1000개</Text> */}
        <View style={styles.actionButtonContainer}>
          <View style={styles.infoContainer}>
            <InfoIconText
              iconProps={{
                font: { type: 'FontAwesomeIcon', name: 'comments-o' },
                size: theme.fontSize.sm,
              }}
              textProps={{
                children: Util.showMaxNumber(item?.totalCommentCount, ITEM_DETAILS_MAX_COUNT),
              }}
            />
            {user ? (
              <InfoIconText
                iconProps={{
                  font: { type: 'FontAwesomeIcon', name: 'sticky-note-o' },
                  size: theme.fontSize.sm,
                }}
                textProps={{
                  children: Util.showMaxNumber(item?.totalMemoCount!, ITEM_DETAILS_MAX_COUNT),
                }}
              />
            ) : null}
          </View>
          <ListItemWishlistIconButton<InfiniteSearchResultData['pages'][number]['items'][number]>
            item={item}
            portalHostName={PortalHostNames.SEARCH}
          />
        </View>
      </View>
    </View>
  );
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  itemNameText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.5,
    fontWeight: 'bold',
  },
  discountRecordContainer: {
    marginVertical: theme.spacing.sm,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
}));

export default SearchResultListItemCardDetailView;
