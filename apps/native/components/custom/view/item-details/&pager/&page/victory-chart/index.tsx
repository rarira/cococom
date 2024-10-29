import { JoinedItems } from '@cococom/supabase/types';
import { Circle, Paint, Text as SKText, useFont } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { CartesianChart, Line, Scatter, useChartPressState } from 'victory-native';

import Text from '@/components/core/text';
import { formatXAxisDate } from '@/libs/date';
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

  const font = useFont(require('@/assets/fonts/Inter_18pt-Medium.ttf'), theme.fontSize.xs);

  const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });

  const dataToShow = useMemo(
    () => discountsData.slice(-maxRecordsToShow),
    [discountsData, maxRecordsToShow],
  );

  const chartData = useMemo(() => {
    return dataToShow.map((discount: NonNullable<JoinedItems['discounts']>[number]) => ({
      x: new Date(discount.startDate).getTime(),
      value: discount[valueField]!,
    }));
  }, [dataToShow, valueField]);

  const discountInfo = useDerivedValue(() => {
    return state.y.value.value.value + '@' + state.x;
  }, [state]);

  const titleText = {
    discount: '할인액 변화',
    discountPrice: '판매가 변화',
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
          yKeys={['value']}
          domainPadding={{
            top: theme.spacing.xl,
            bottom: theme.spacing.xl,
            left: theme.spacing.xl,
            right: theme.spacing.xl,
          }}
          chartPressState={state}
          yAxis={[
            {
              font,
            },
          ]}
        >
          {({ points, canvasSize }) => {
            return (
              <>
                {/* <SKText
                  x={chartBounds.left + 10}
                  y={chartBounds.bottom}
                  font={font}
                  text={discountInfo}
                  color={theme.colors.typography}
                  style={'fill'}
                /> */}
                <Line
                  points={points.value}
                  color={theme.colors.graphStroke}
                  strokeWidth={3}
                  animate={{ type: 'timing', duration: 300 }}
                />
                <Scatter
                  points={points.value}
                  color={theme.colors.background}
                  shape="circle"
                  radius={theme.spacing.md}
                  style={'fill'}
                >
                  <Paint color={theme.colors.graphStroke} style="stroke" strokeWidth={3} />
                </Scatter>
                {points.value.map(point => {
                  const isYAtBottomCanvas = point.y! > canvasSize.height / 2;
                  if (!font) return null;
                  return (
                    <SKText
                      x={point.x}
                      y={point.y!}
                      font={font}
                      text={formatXAxisDate(new Date(point.xValue))}
                      color={theme.colors.typography}
                      style={'fill'}
                      transform={[
                        {
                          translate: [
                            point.x - theme.spacing.md / 2,
                            isYAtBottomCanvas
                              ? point.y! -
                                (font.measureText(formatXAxisDate(new Date(point.xValue))).width +
                                  theme.spacing.xl)
                              : point.y! + theme.spacing.xl,
                          ],
                        },
                        { rotate: (90 * Math.PI) / 180 }, // 45도 회전 (라디안 단위로 변환)
                        { translate: [-point.x, -point.y!] },
                      ]}
                    />
                  );
                })}
                {isActive && <ToolTip x={state.x.position} y={state.y.value.position} />}
              </>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
});

const ToolTip = memo(function ToolTip({
  x,
  y,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
}) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
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
  },
}));

export default ItemDetailsPagerVictoryChartPageView;
