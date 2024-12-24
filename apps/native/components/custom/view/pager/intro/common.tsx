import { memo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ColorSchemeName, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image, ImageSource } from 'expo-image';

import { IntroPageProps } from '@/libs/type';
import { useColorScheme } from '@/hooks/useColorScheme';
import Text from '@/components/core/text';

export type ImagesForCommonIntroPagerView = Record<
  NonNullable<ColorSchemeName>,
  Record<string, { image: ImageSource; text: string }>
>;

type CommonIntroPagerViewProps = IntroPageProps & {
  images: ImagesForCommonIntroPagerView;
};

const CommonIntroPagerView = memo(function CommonIntroPagerView({
  pageNo,
  activePageNo,
  images,
}: CommonIntroPagerViewProps) {
  const [width, setWidth] = useState(0);
  const { styles } = useStyles(stylesheet);
  const { currentScheme } = useColorScheme();

  return (
    <View style={styles.container} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {!width ? null : (
        <Carousel
          width={width}
          data={Object.keys(images[currentScheme])}
          defaultIndex={0}
          autoPlay={pageNo === activePageNo}
          loop
          enabled={false}
          autoPlayInterval={2000}
          renderItem={({ item }) => {
            return (
              <View style={styles.carouselItemContainer}>
                <Image
                  source={images[currentScheme][item].image}
                  style={styles.image}
                  contentFit="contain"
                />
                <Text style={styles.caption}>{images[currentScheme][item].text}</Text>
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
    color: theme.colors.tint,
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
}));

export default CommonIntroPagerView;
