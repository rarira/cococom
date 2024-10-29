import { JoinedItems } from '@cococom/supabase/types';
import { useFont } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { CartesianChart, Line } from 'victory-native';

import Text from '@/components/core/text';
interface ItemDetailsPagerVictoryChartPageViewProps {
  discountsData: NonNullable<JoinedItems['discounts']>;
  valueField: keyof Pick<
    NonNullable<JoinedItems['discounts']>[number],
    'discount' | 'discountPrice' | 'discountRate'
  >;
  maxRecordsToShow?: number;
}

const ItemDetailsPagerVictoryChartPageView = memo(function ItemDetailsPagerVictoryChartPageView({
  discountsData,
  valueField,
  maxRecordsToShow = 10,
}: ItemDetailsPagerVictoryChartPageViewProps) {
  const { styles, theme } = useStyles(stylesheet);
  const font = useFont(require('../../../../../../../assets/fonts/Inter_18pt-Medium.ttf'), 12);

  const dataToShow = useMemo(
    () => discountsData.slice(-maxRecordsToShow),
    [discountsData, maxRecordsToShow],
  );

  const chartData = useMemo(() => {
    return dataToShow.map((discount: NonNullable<JoinedItems['discounts']>[number]) => ({
      x: discount.startDate,
      y: discount[valueField]!,
    }));
  }, [dataToShow, valueField]);

  const yAxisLabel = useMemo(() => {
    switch (valueField) {
      case 'discount':
        return '할인가격';
      case 'discountPrice':
        return '판매가격';
      case 'discountRate':
        return '할인율(%)';
      default:
        return '';
    }
  }, [valueField]);

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

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{titleText}</Text>
        <Text
          style={styles.subTitleText}
        >{`(최근 최대 ${maxRecordsToShow} 건, 단위 ${unitText})`}</Text>
      </View>
      <View style={styles.graphContainer}>
        <CartesianChart
          data={chartData}
          xKey={'x'}
          yKeys={['y']}
          padding={theme.spacing.lg}
          axisOptions={{ font }}
          xAxis={{
            font,
            formatXLabel: label => {
              return label?.split('T')[0] ?? '';
            },
            labelColor: theme.colors.typography,
          }}
        >
          {({ points, xScale }) => {
            console.log('data', points.y, xScale);
            return (
              // 👇 and we'll use the Line component to render a line path.
              <Line
                points={points.y}
                color="red"
                strokeWidth={3}
                animate={{ type: 'timing', duration: 300 }}
              />
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
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
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
  },
}));

export default ItemDetailsPagerVictoryChartPageView;
