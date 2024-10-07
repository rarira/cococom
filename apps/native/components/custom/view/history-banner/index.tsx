import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';

import HistoryTable from '../../table/history';

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

  console.log('fetchHistory', { data });

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title}>최신 할인 정보 업데이트 </Text>
        <Text style={styles.infoText}>{totalDiscounts} 개 할인 중</Text>
      </View>
      <HistoryTable data={data} />
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    backgroundColor: theme.colors.tint3,
    width: '100%',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  rowContainer: {
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
    fontSize: theme.fontSize.normal,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
}));

export default HistoryInfoBanner;
