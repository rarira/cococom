import { QueryKey } from '@tanstack/react-query';
import { Href, Link } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Card from '@/components/core/card';
import ProductCardThumbnailImage from '@/components/custom/image/list-item-card-thumbnail';
import DiscountListItemCardDetailView from '@/components/custom/view/list-item-card/discount/&detail';
import { PortalHostNames } from '@/constants';
import { CurrentDiscounts } from '@/hooks/discount/useDiscountListQuery';
import { shadowPresets } from '@/libs/shadow';
import { useListQueryKeyStore } from '@/store/list-query-key';

export interface DiscountListItemCardProps {
  discount: Awaited<CurrentDiscounts>[number];
  numColumns?: number;
  containerStyle?: StyleProp<ViewStyle>;
  queryKeyOfList: QueryKey;
  portalHostName: PortalHostNames;
}

function DiscountListItemCard({
  discount,
  numColumns = 1,
  containerStyle,
  queryKeyOfList,
  portalHostName,
}: DiscountListItemCardProps) {
  const { styles, theme } = useStyles(stylesheet);

  const setQueryKeyOfList = useListQueryKeyStore(state => state.setQueryKeyOfList);

  const handlePress = useCallback(() => {
    setQueryKeyOfList(queryKeyOfList);
  }, [queryKeyOfList, setQueryKeyOfList]);

  const isOnline = discount.is_online;

  return (
    <Link href={`/item?itemId=${discount.items.id}` as Href<string>} asChild onPress={handlePress}>
      <Pressable>
        <Shadow {...shadowPresets.card(theme)} stretch>
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
        </Shadow>
      </Pressable>
    </Link>
  );
}

const stylesheet = createStyleSheet(theme => ({
  cardContainer: (needMargin: boolean, isOnline: boolean) => ({
    marginHorizontal: needMargin ? theme.spacing.sm : 0,
    borderRadius: theme.borderRadius.md,
    backgroundColor: isOnline ? `${theme.colors.tint3}11` : theme.colors.cardBackground,
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
