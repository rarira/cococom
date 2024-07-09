import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { CurrentDiscounts } from '@/app/(tabs)';
import { ThemedText } from '@/components/_old/ThemedText';

import Card from '..';
import ProductCardThumbnailImage from '../../image/product-card-thumbnail';

function ListItemCard({
  item,
  index,
  numColumns = 1,
}: {
  item: Awaited<CurrentDiscounts>[number];
  index: number;
  numColumns?: number;
}) {
  const { styles } = useStyles(stylesheet);

  return (
    <Card
      style={styles.cardContainer({
        needMargin: numColumns > 1,
        first: index % numColumns === 0,
        last: index % numColumns === numColumns - 1,
      })}
    >
      <View style={styles.itemContainer(numColumns === 1)}>
        <ProductCardThumbnailImage product={item.items!} />
        <View>
          <ThemedText>{item.items?.itemName}</ThemedText>
          <ThemedText>{item.discountPrice}</ThemedText>
        </View>
      </View>
    </Card>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: ({
    first,
    last,
    needMargin,
  }: {
    first: boolean;
    last: boolean;
    needMargin: boolean;
  }) => ({
    marginRight: last ? 0 : theme.spacing.md,
    marginLeft: first ? 0 : theme.spacing.md,
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
    padding: theme.spacing.lg,
  }),
}));

export default ListItemCard;
