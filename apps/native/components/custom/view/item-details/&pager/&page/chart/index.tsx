import { JoinedItems } from '@cococom/supabase/types';
import { Circle, Paint, Text as SKText, useFont } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { CartesianChart, Line, Scatter, useChartPressState } from 'victory-native';

import Text from '@/components/core/text';
import { formatXAxisDate } from '@/libs/date';
interface ItemDetailsPagerChartPageViewProps {
  discountsData: NonNullable<JoinedItems['discounts']>;
  valueField: keyof Pick<
    NonNullable<JoinedItems['discounts']>[number],
    'discount' | 'discountPrice' | 'discountRate'
  >;
  maxRecordsToShow?: number;
}

const ItemDetailsPagerChartPageView = memo(function ItemDetailsPagerChartPageView({
  discountsData,
  valueField,
  maxRecordsToShow = 10,
}: ItemDetailsPagerChartPageViewProps) {
  const { styles, theme } = useStyles(stylesheet);

  const font = useFont(require('@/assets/fonts/Inter_18pt-Medium.ttf'), theme.fontSize.xs);
  const discountInfoFont = useFont(
    require('@/assets/fonts/Inter_18pt-Medium.ttf'),
    theme.fontSize.md,
  );

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
    if (valueField === 'discountRate') {
      return (state.y.value.value.value * 100).toFixed() + '%';
    }
    return '\u20A9' + state.y.value.value.value.toLocaleString();
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
              formatYLabel: (value: number) => {
                if (valueField === 'discountRate') {
                  return (value * 100).toFixed();
                }
                return value.toLocaleString();
              },
            },
          ]}
        >
          {({ points, canvasSize }) => {
            const isXCanvasLeft = state.x.position.value < canvasSize.width / 2;
            const isYCanvasTop = state.y.value.position.value < canvasSize.height / 2;
            return (
              <>
                {isActive && (
                  <SKText
                    x={
                      isXCanvasLeft
                        ? state.x.position.value + theme.spacing.lg
                        : state.x.position.value -
                          font!.measureText(discountInfo.value).width * 2 -
                          theme.spacing.lg
                    }
                    y={
                      isYCanvasTop
                        ? state.y.value.position.value + theme.spacing.lg * 2
                        : state.y.value.position.value - theme.spacing.lg
                    }
                    font={discountInfoFont}
                    text={discountInfo}
                    color={theme.colors.tint}
                    style={'fill'}
                  />
                )}
                <Line
                  points={points.value}
                  color={theme.colors.graphStroke}
                  opacity={isActive ? 0.2 : 1}
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
                  <Paint
                    color={theme.colors.graphStroke}
                    style="stroke"
                    strokeWidth={3}
                    opacity={isActive ? 0.2 : 1}
                  />
                </Scatter>
                {points.value.map(point => {
                  const isYAtBottomCanvas = point.y! > canvasSize.height / 2;
                  const isActivePoint = isActive && point.x === state.x.position.value;
                  if (!font) return null;
                  return (
                    <SKText
                      x={point.x}
                      y={point.y!}
                      font={font}
                      text={formatXAxisDate(new Date(point.xValue))}
                      color={theme.colors.typography}
                      opacity={!isActive ? 1 : isActivePoint ? 1 : 0.2}
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
  const { theme } = useStyles(stylesheet);

  return <Circle cx={x} cy={y} r={8} color={theme.colors.graphStroke} />;
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

export default ItemDetailsPagerChartPageView;
