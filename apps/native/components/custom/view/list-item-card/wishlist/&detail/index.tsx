import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Chip from '@/components/core/chip';
import Text from '@/components/core/text';
import DiscountPeriodText from '@/components/custom/text/discount-period';
import { WishlistToRender } from '@/hooks/wishlist/useWishlists';

import ListItemCardChipsView from '../../chips';

interface WishlistItemCardDetailViewProps {
  item: WishlistToRender[number];
}

function WishlistItemCardDetailView({ item }: WishlistItemCardDetailViewProps) {
  const { styles } = useStyles(stylesheets);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.itemNameText} numberOfLines={3}>
          {item.itemName}
        </Text>
        <View style={styles.footer}>
          {item.isOnSaleNow ? (
            <>
              <ListItemCardChipsView item={item} discount={item.discount!} />
              <DiscountPeriodText endDate={item.discount!.endDate} />
            </>
          ) : (
            <View />
          )}
        </View>
      </View>
      {item.isOnSaleNow ? <Chip text="할인 중" style={styles.onSaleChip} /> : null}
    </View>
  );
}

const stylesheets = createStyleSheet(theme => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
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
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.normal * 1.2,
    marginVertical: theme.spacing.md,
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
    gap: theme.spacing.md,
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
  onSaleChip: {
    position: 'absolute',
    top: -theme.spacing.md,
    right: -theme.spacing.md,
  },
}));

export default WishlistItemCardDetailView;
