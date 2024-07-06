import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ThemedText } from '@/components/_old/ThemedText';
import { ThemedView } from '@/components/_old/ThemedView';
import Card from '@/components/ui/card';
import { supabase } from '@/libs/supabase';

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => supabase.fetchCurrentDiscounts(),
  });

  return (
    // <View style={{ flex: 1 }}>
    //   <Text>Adaptive themes are {UnistylesRuntime.hasAdaptiveThemes ? 'enabled' : 'disabled'}</Text>
    <FlashList
      data={data}
      renderItem={({ item, index }) => (
        <Card style={styles.cardStyle(index % 2 === 0)}>
          <ThemedView style={styles.stepContainer}>
            <ThemedText>{item.id}</ThemedText>
            <ThemedText>{item.itemId}</ThemedText>
          </ThemedView>
        </Card>
      )}
      keyExtractor={item => item.id + ''}
      estimatedItemSize={600}
      numColumns={2}
      ItemSeparatorComponent={() => <View style={styles.seperatorStyle} />}
      contentContainerStyle={styles.flashListContainer}
    />
    // </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  stepContainer: {
    padding: theme.spacing.lg,
  },
  flashListContainer: {
    padding: theme.spacing.xl,
  },
  seperatorStyle: {
    height: theme.spacing.md * 2,
  },
  cardStyle: (isEven: boolean) => ({
    marginRight: isEven ? theme.spacing.md : 0,
    marginLeft: isEven ? 0 : theme.spacing.md,
  }),
}));
