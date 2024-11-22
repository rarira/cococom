import { useQuery } from '@tanstack/react-query';
import { memo, useEffect } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import HistoryTable from '@/components/custom/table/history';
import { queryKeys } from '@/libs/react-query';
import { supabase } from '@/libs/supabase';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface HistoryInfoBannerProps {
  totalDiscounts: number;
}

function fetchLatestHistory() {
  return supabase.histories.fetchLatestHistory();
}

const HistoryInfoBanner = memo(function HistoryInfoBanner({
  totalDiscounts,
}: HistoryInfoBannerProps) {
  const { styles } = useStyles(stylesheet);

  const { reportToSentry } = useErrorHandler();

  const { data, error, isLoading } = useQuery({
    queryKey: queryKeys.histories.latest,
    queryFn: fetchLatestHistory,
  });

  useEffect(() => {
    if (error) {
      reportToSentry(error);
    }
  }, [error, reportToSentry]);

  if (!data || isLoading) return null;

  return (
    <View style={styles.container}>
      {error ? (
        <Text>에러 발생</Text>
      ) : (
        <>
          <View style={styles.rowContainer}>
            <Text style={styles.title}>최신 할인 정보 업데이트 </Text>
            <Text style={styles.infoText}>{totalDiscounts} 개 할인 중</Text>
          </View>
          <HistoryTable data={data} />
        </>
      )}
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
    color: 'white',
    fontWeight: 'bold',
  },
  time: {
    fontSize: theme.fontSize.sm,
    color: 'white',
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
    color: 'white',
    fontWeight: 'bold',
  },
}));

export default HistoryInfoBanner;
