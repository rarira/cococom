import { Href, Link } from 'expo-router';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import DiscountListItemCardDetailView from '@/components/custom/view/list-item-card/discount/&detail';
import { PortalHostNames } from '@/constants';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';
import { ShadowPresets } from '@/libs/shadow';

export interface DiscountListItemCardProps {
  discount: Awaited<CurrentDiscounts>[number];
  numColumns?: number;
  containerStyle?: StyleProp<ViewStyle>;
  portalHostName: PortalHostNames;
}

function DiscountListItemCard({
  discount,
  numColumns = 1,
  containerStyle,
  portalHostName,
}: DiscountListItemCardProps) {
  const { styles } = useStyles(stylesheet);

  const isOnline = discount.is_online;

  return (
    <Link href={`/item?itemId=${discount.items.id}` as Href<string>} asChild>
      <Pressable>
        <Card style={[styles.cardContainer(numColumns > 1, isOnline), containerStyle]}>
          <View style={styles.itemContainer(numColumns === 1)}>
            <ProductCardThumbnailImage
              product={discount.items!}
              width={115}
              height={115}
              style={styles.thumbnail}
              isOnline={discount.is_online}
            />
            <DiscountListItemCardDetailView discount={discount} portalHostName={portalHostName} />
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean, isOnline: boolean) => ({
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.md,
    backgroundColor: isOnline ? `${theme.colors.tint3}11` : theme.colors.cardBackground,
    ...ShadowPresets.card(theme),
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

export default DiscountListItemCard;
