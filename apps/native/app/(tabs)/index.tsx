import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/libs/supabase';

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => supabase.fetchCurrentDiscounts(),
  });

  console.log({ data });
  return (
    <FlashList
      data={data}
      renderItem={({ item }) => (
        <ThemedView style={styles.stepContainer}>
          <ThemedText>{item.id}</ThemedText>
          <ThemedText>{item.itemId}</ThemedText>
        </ThemedView>
      )}
      estimatedItemSize={44}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    flex: 1,
    border: `1px solid black`,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
}));
