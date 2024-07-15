import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemCard from '@/components/ui/card/list-item';
import useSession from '@/hooks/useSession';
import { supabase } from '@/libs/supabase';

function fetchCurrentDiscounts(userId?: string) {
  return supabase.fetchCurrentDiscountsWithWishlistCount(userId);
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

const NumberOfColumns = 1;

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const session = useSession();

  console.log({ session });

  const { data, error, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => fetchCurrentDiscounts(session?.user?.id),
  });

  console.log('fetchDiscount', { data });
  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <ListItemCard discount={item} numColumns={NumberOfColumns} />;
    },
    [],
  );

  if (!data || error || isLoading) return null;

  return (
    // <View style={{ flex: 1 }}>
    //   <Text>Adaptive themes are {UnistylesRuntime.hasAdaptiveThemes ? 'enabled' : 'disabled'}</Text>
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={600}
      keyExtractor={item => item.id.toString()}
      numColumns={NumberOfColumns}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.flashListContainer(NumberOfColumns > 1)}
    />
    // </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: (isMultiColumn: boolean) => ({
    padding: isMultiColumn ? theme.spacing.xl : theme.spacing.lg,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));
