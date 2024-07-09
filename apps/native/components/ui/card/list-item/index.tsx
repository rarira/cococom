import { StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { CurrentDiscounts } from '@/app/(tabs)';

import Card from '..';
import ProductCardThumbnailImage from '../../image/product-card-thumbnail';
import Text from '../../text';

function ListItemCard({
  item,
  numColumns = 1,
  containerStyle,
}: {
  item: Awaited<CurrentDiscounts>[number];
  numColumns?: number;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  const { styles } = useStyles(stylesheet);

  return (
    <Card style={[styles.cardContainer(numColumns > 1), containerStyle]}>
      <View style={styles.itemContainer(numColumns === 1)}>
        <ProductCardThumbnailImage product={item.items!} />
        <View>
          <Text style={styles.itemNameText} numberOfLines={3}>
            {item.items?.itemName}
          </Text>
          <Text>{item.discountPrice}</Text>
        </View>
      </View>
    </Card>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean) => ({
    height: 200,
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }),
  itemContainer: (row: boolean) => ({
    flex: 1,
    flexDirection: row ? 'row' : 'column',
    justifyContent: row ? 'space-between' : 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
  }),
  itemNameText: {
    fontSize: theme.fontSize.sm,
    lineHeight: 15,
  },
}));

export default ListItemCard;
