import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/ui/text';
import { formatLongLocalizedDate } from '@/libs/date';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

interface HistoryInfoBannerProps {
  totalDiscounts: number;
}

function fetchLatestHistory() {
  return supabase.fetchLatestHistory();
}

const HistoryInfoBanner = memo(function HistoryInfoBanner({
  totalDiscounts,
}: HistoryInfoBannerProps) {
  const { styles } = useStyles(stylesheet);

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.histories.latest,
    queryFn: fetchLatestHistory,
  });

  if (!data || error || isLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>최신 할인 정보 업데이트 </Text>
        <Text style={styles.time}>{formatLongLocalizedDate(data?.[0].created_at!)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>총 할인 : {totalDiscounts} 개,</Text>
        <Text style={styles.infoText}>신규 상품 : {data?.[0].new_item_count} 상품,</Text>
        <Text style={styles.infoText}>신규 할인 : {data?.[0].added_discount_count} 개</Text>
      </View>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.tint,
    width: '100%',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  time: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.background,
    opacity: 0.8,
    fontWeight: 'semibold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.link,
    opacity: 0.8,
    fontWeight: 'semibold',
  },
}));

export default HistoryInfoBanner;
