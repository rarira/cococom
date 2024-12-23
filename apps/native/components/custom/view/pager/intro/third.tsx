import { memo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ColorSchemeName, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image, ImageSource } from 'expo-image';

import { IntroPageProps } from '@/libs/type';
import { useColorScheme } from '@/hooks/useColorScheme';
import Text from '@/components/core/text';

const Images: Record<
  NonNullable<ColorSchemeName>,
  Record<string, { image: ImageSource; text: string }>
> = {
  light: {
    1: {
      image: require('@/assets/images/intro/third-light-1.png'),
      text: '검색 탭내 별표 버튼 예',
    },
    2: { image: require('@/assets/images/intro/third-light-2.png'), text: '마이 탭 > 관심상품' },
    3: { image: require('@/assets/images/intro/third-light-3.png'), text: '홈 탭 > 알림센터' },
  },
  dark: {
    1: {
      image: require('@/assets/images/intro/third-dark-1.png'),
      text: '검색 탭내 별표 버튼 예',
    },
    2: { image: require('@/assets/images/intro/third-dark-2.png'), text: '마이 탭 > 관심상품' },
    3: { image: require('@/assets/images/intro/third-dark-3.png'), text: '홈 탭 > 알림센터' },
  },
};

const ThirdIntroPagerView = memo(function ThirdIntroPagerView({
  pageNo,
  activePageNo,
  ...restProps
}: IntroPageProps) {
  const [width, setWidth] = useState(0);
  const { styles } = useStyles(stylesheet);
  const { currentScheme } = useColorScheme();

  return (
    <View style={styles.container} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {!width ? null : (
        <Carousel
          width={width}
          data={Object.keys(Images[currentScheme])}
          defaultIndex={0}
          autoPlay={pageNo === activePageNo}
          loop
          enabled={false}
          autoPlayInterval={2000}
          renderItem={({ item }) => {
            return (
              <View style={styles.carouselItemContainer}>
                <Image
                  source={Images[currentScheme][item].image}
                  style={styles.image}
                  contentFit="contain"
                />
                <Text style={styles.caption}>{Images[currentScheme][item].text}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    width: '100%',
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    aspectRatio: 1.15,
    width: '100%',
    borderColor: 'red',
  },
  caption: {
    color: theme.colors.graphStroke,
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
}));

export default ThirdIntroPagerView;
