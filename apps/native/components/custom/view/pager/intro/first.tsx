import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ColorSchemeName, View } from 'react-native';
import { Image, ImageSource } from 'expo-image';

import { IntroPageProps } from '@/libs/type';
import { useRequestPermissionInIntro } from '@/hooks/notification/useRequestPermissionInIntro';
import { useColorScheme } from '@/hooks/useColorScheme';

const Images: Record<NonNullable<ColorSchemeName>, ImageSource> = {
  light: require('@/assets/images/intro/first-light.png'),
  dark: require('@/assets/images/intro/first-dark.png'),
};

const FirstIntroPagerView = memo(function FirstIntroPagerView({
  pageNo,
  activePageNo,
  ...restProps
}: IntroPageProps) {
  const { styles } = useStyles(stylesheet);
  const { currentScheme } = useColorScheme();

  useRequestPermissionInIntro(pageNo, activePageNo);

  return (
    <View style={styles.container}>
      <Image source={Images[currentScheme]} style={styles.image} contentFit="contain" />
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

export default FirstIntroPagerView;
