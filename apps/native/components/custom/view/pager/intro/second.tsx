import { memo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ColorSchemeName, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image, ImageSource } from 'expo-image';

import { IntroPageProps } from '@/libs/type';
import { useColorScheme } from '@/hooks/useColorScheme';

const Images: Record<NonNullable<ColorSchemeName>, Record<string, ImageSource>> = {
  light: {
    1: require('@/assets/images/intro/second-light-1.png'),
    2: require('@/assets/images/intro/second-light-2.png'),
    3: require('@/assets/images/intro/second-light-3.png'),
  },
  dark: {
    1: require('@/assets/images/intro/second-dark-1.png'),
    2: require('@/assets/images/intro/second-dark-2.png'),
    3: require('@/assets/images/intro/second-dark-3.png'),
  },
};

const SecondIntroPagerView = memo(function SecondIntroPagerView({
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
              <View
                style={{
                  flex: 1,
                }}
              >
                <Image
                  source={Images[currentScheme][item]}
                  style={styles.image}
                  contentFit="contain"
                />
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
  image: {
    width: '100%',
    height: '100%',
  },
}));

export default SecondIntroPagerView;
