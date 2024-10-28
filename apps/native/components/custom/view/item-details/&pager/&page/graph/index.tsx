import { JoinedItems } from '@cococom/supabase/types';
import * as scale from 'd3-scale';
import { format, parseISO } from 'date-fns';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Circle } from 'react-native-svg';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import { X_AXIS_HEIGHT } from '@/constants';
import Util from '@/libs/util';

interface ItemDetailsPagerGraphPageViewProps {
  valueField: keyof Pick<
    NonNullable<JoinedItems['discounts']>[0],
    'discount' | 'discountPrice' | 'discountRate'
  >;
  discountsData: NonNullable<JoinedItems['discounts']>;
  maxRecordsToShow?: number;
}

const ItemDetailsPagerGraphPageView = memo(function ItemDetailsPagerGraphPageView({
  valueField,
  discountsData,
  maxRecordsToShow = 10,
}: ItemDetailsPagerGraphPageViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const dataToShow = useMemo(
    () => discountsData.slice(-maxRecordsToShow),
    [discountsData, maxRecordsToShow],
  );

  const yAxisData = useMemo(
    () => dataToShow.map(item => item[valueField]),
    [dataToShow, valueField],
  );

  const xAxisData = useMemo(() => dataToShow.map(item => new Date(item.startDate)), [dataToShow]);

  const Decorator = useCallback(
    ({ x, y }: any) => {
      return (
        dataToShow?.map((value, index) => (
          <Circle
            key={index}
            cx={x(parseISO(value.startDate).getTime())}
            cy={y(value[valueField])}
            r={theme.fontSize.xxs / 2}
            stroke={theme.colors.graphStroke}
            fill={theme.colors.background}
          />
        )) ?? null
      );
    },
    [dataToShow, theme.colors.background, theme.colors.graphStroke, theme.fontSize.xxs, valueField],
  );

  const verticalContentInset = useMemo(
    () => ({
      top: theme.spacing.lg,
      bottom: theme.spacing.lg,
      left: theme.spacing.lg,
      right: theme.spacing.lg,
    }),
    [theme.spacing.lg],
  );

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
        <YAxis
          data={yAxisData}
          style={styles.yAxis}
          contentInset={verticalContentInset}
          svg={{ fontSize: theme.fontSize.xxs, fill: theme.colors.typography }}
          numberOfTicks={maxRecordsToShow / 2}
          formatLabel={value =>
            valueField === 'discountRate' ? Util.toPercentString(value) : Util.toWonString(value)
          }
        />
        <View style={styles.chartContainer}>
          <LineChart
            style={styles.lineChart}
            data={dataToShow}
            xAccessor={({ item }) => parseISO(item.startDate).getTime()}
            yAccessor={({ item }) => item[valueField]!}
            svg={{ stroke: theme.colors.graphStroke, strokeWidth: 2 }}
            xScale={scale.scaleTime}
            numberOfTicks={maxRecordsToShow / 2}
            contentInset={verticalContentInset}
          >
            <Grid svg={{ stroke: `${theme.colors.shadow}99` }} />
            <Decorator />
          </LineChart>
          <XAxis
            data={xAxisData}
            svg={{
              fill: theme.colors.typography,
              fontSize: theme.fontSize.xxs,
              rotation: 90,
              originY: 20,
            }}
            xAccessor={({ item }) => item}
            scale={scale.scaleTime}
            style={styles.XAxis}
            contentInset={{ left: -4, right: 28 }}
            formatLabel={value => format(value, 'yyyy-MM')}
          />
        </View>
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
    flexDirection: 'row',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
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

export default ItemDetailsPagerGraphPageView;
