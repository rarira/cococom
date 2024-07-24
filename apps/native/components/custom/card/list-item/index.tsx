import { StyleProp, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { CurrentDiscounts } from '@/hooks/useDiscountListQuery';

import Card from '../../../ui/card';
import ProductCardThumbnailImage from '../../image/list-item-card-thumbnail';
import ListItemCardDetailView from '../../view/list-item-card/detail';

export interface ListItemCardProps {
  discount: Awaited<CurrentDiscounts>[number];
  numColumns?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

function ListItemCard({ discount, numColumns = 1, containerStyle }: ListItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Shadow
      style={{ flex: 1, width: '100%' }}
      offset={[theme.spacing.sm / 2, theme.spacing.sm / 2]}
      startColor={`${theme.colors.shadow}22`}
      distance={theme.spacing.sm}
      sides={{ start: false, top: false, bottom: true, end: true }}
      corners={{ topStart: false, topEnd: true, bottomStart: true, bottomEnd: true }}
      // containerStyle={{ borderRadius: theme.borderRadius.md }}
    >
      <Card style={[styles.cardContainer(numColumns > 1), containerStyle]}>
        <View style={styles.itemContainer(numColumns === 1)}>
          <ProductCardThumbnailImage
            product={discount.items!}
            width={115}
            height={115}
            style={styles.thumbnail}
          />
          <ListItemCardDetailView discount={discount} />
        </View>
      </Card>
    </Shadow>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean) => ({
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.md,
  }),
  itemContainer: (row: boolean) => ({
    flex: 1,
    flexDirection: row ? 'row' : 'column',
    justifyContent: row ? 'space-between' : 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
  }),
  thumbnail: {
    borderRadius: theme.borderRadius.md,
  },
}));

export default ListItemCard;
