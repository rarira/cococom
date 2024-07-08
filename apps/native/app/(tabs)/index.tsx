import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ListItemCard from '@/components/ui/card/list-item';
import { supabase } from '@/libs/supabase';

function fetchCurrentDiscounts() {
  return supabase.fetchCurrentDiscounts();
}

export type CurrentDiscounts = NonNullable<ReturnType<typeof fetchCurrentDiscounts>>;

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => fetchCurrentDiscounts(),
  });

  const renderItem = useCallback(
    ({ item, index }: { item: NonNullable<typeof data>[number]; index: number }) => {
      return <ListItemCard item={item} index={index} numColumns={3} />;
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
      numColumns={3}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.flashListContainer}
    />
    // </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  flashListContainer: {
    padding: theme.spacing.xl,
  },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
  // cardStyle: (isEven: boolean) => ({
  //   marginRight: isEven ? theme.spacing.md : 0,
  //   marginLeft: isEven ? 0 : theme.spacing.md,
  // }),
}));
