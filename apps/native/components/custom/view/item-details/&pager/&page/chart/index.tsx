import { JoinedItems } from '@cococom/supabase/types';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import { X_AXIS_HEIGHT } from '@/constants';

interface ItemDetailsPagerChartPageViewProps {
  valueField: keyof Pick<
    NonNullable<JoinedItems['discounts']>[number],
    'discount' | 'discountPrice' | 'discountRate'
  >;
  discountsData: NonNullable<JoinedItems['discounts']>;
  maxRecordsToShow?: number;
}

const ItemDetailsPagerChartPageView = memo(function ItemDetailsPagerChartPageView({
  valueField,
  discountsData,
  maxRecordsToShow = 10,
}: ItemDetailsPagerChartPageViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const dataToShow = useMemo(
    () => discountsData.slice(-maxRecordsToShow),
    [discountsData, maxRecordsToShow],
  );

  const data = useMemo(
    () =>
      dataToShow.map(item => ({
        value: item[valueField] ?? 0,
        label: item.startDate.split('T')[0],
      })),
    [dataToShow, valueField],
  );

  const xAxisData = useMemo(() => dataToShow.map(item => item.startDate), [dataToShow]);

  // const Decorator = useCallback(
  //   ({ x, y }: any) => {
  //     return (
  //       dataToShow?.map((value, index) => (
  //         <Circle
  //           key={index}
  //           cx={x(parseISO(value.startDate).getTime())}
  //           cy={y(value[valueField])}
  //           r={theme.fontSize.xxs / 2}
  //           stroke={theme.colors.graphStroke}
  //           fill={theme.colors.background}
  //         />
  //       )) ?? null
  //     );
  //   },
  //   [dataToShow, theme.colors.background, theme.colors.graphStroke, theme.fontSize.xxs, valueField],
  // );

  // const verticalContentInset = useMemo(
  //   () => ({
  //     top: theme.spacing.lg,
  //     bottom: theme.spacing.lg,
  //     left: theme.spacing.lg,
  //     right: theme.spacing.lg,
  //   }),
  //   [theme.spacing.lg],
  // );

  const titleText = {
    discount: '할인 금액 변화',
    discountPrice: '할인 후 가격 변화',
    discountRate: '할인율 변화',
  }[valueField];

  const unitText = {
    discount: '원',
    discountPrice: '원',
    discountRate: '%',
  }[valueField];

  if (!dataToShow) return null;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{titleText}</Text>
        <Text
          style={styles.subTitleText}
        >{`(최근 최대 ${maxRecordsToShow} 건, 단위 ${unitText})`}</Text>
      </View>
      <View style={styles.graphContainer}>
        <LineChart data={data} yAxisOffset={5000} />
      </View>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: theme.spacing.lg,
  },
  titleText: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
  },
  subTitleText: {
    fontSize: theme.fontSize.xs,
    fontWeight: 'semibold',
    color: theme.colors.tint,
  },
  graphContainer: {
    flex: 1,
    // width: '100%',
    borderWidth: 1,
    borderColor: 'red',
    // flexDirection: 'row',
    // paddingVertical: theme.spacing.lg,
  },
  yAxis: {
    marginBottom: X_AXIS_HEIGHT,
  },
  chartContainer: {
    flex: 1,
    width: 'auto',
  },
  lineChart: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  XAxis: {
    height: X_AXIS_HEIGHT,
    marginLeft: theme.spacing.lg,
  },
}));

export default ItemDetailsPagerChartPageView;
