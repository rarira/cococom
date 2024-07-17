import { PortalHost } from '@gorhom/portal';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemCard from '@/components/custom/card/list-item';
import { PortalHostNames } from '@/constants';
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

  const { data, error, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => fetchCurrentDiscounts(session?.user?.id),
  });

  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <ListItemCard discount={item} numColumns={NumberOfColumns} />;
    },
    [],
  );

  if (!data || error || isLoading) return null;

  return (
    <>
      <View style={styles.container}>
        <FlashList
          data={data}
          renderItem={renderItem}
          estimatedItemSize={600}
          keyExtractor={item => item.id.toString()}
          numColumns={NumberOfColumns}
          ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
          contentContainerStyle={styles.flashListContainer(NumberOfColumns > 1)}
        />
      </View>
      <PortalHost name={PortalHostNames.HOME} />
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flashListContainer: (isMultiColumn: boolean) => ({
    padding: isMultiColumn ? theme.spacing.xl : theme.spacing.lg,
    backgroundColor: theme.colors.background,
  }),
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
}));
