import { JoinedItems } from '@cococom/supabase/types';
import { useFont } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { CartesianChart, Line } from 'victory-native';

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

  console.log('font', font);
  const dataToShow = useMemo(
    () => discountsData.slice(-maxRecordsToShow),
    [discountsData, maxRecordsToShow],
  );

  const chartData = useMemo(() => {
    return dataToShow?.map((discount: NonNullable<JoinedItems['discounts']>[number]) => ({
      x: discount.startDate,
      y: discount[valueField]!,
    }));
  }, [dataToShow, valueField]);

  console.log({ dataToShow, chartData });
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

  return (
    <View style={styles.container}>
      <CartesianChart
        data={chartData}
        xKey={'x'}
        yKeys={['y']}
        padding={theme.spacing.lg}
        xAxis={{
          font,
          formatXLabel: label => {
            return label?.split('T')[0];
          },
          labelColor: theme.colors.typography,
        }}
      >
        {data => {
          console.log('points', { data });
          return (
            // 👇 and we'll use the Line component to render a line path.
            <Line points={data.points.y} color="red" strokeWidth={3} />
          );
        }}
      </CartesianChart>
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: theme.colors.cardBackground,
  },
}));

export default ItemDetailsPagerVictoryChartPageView;
