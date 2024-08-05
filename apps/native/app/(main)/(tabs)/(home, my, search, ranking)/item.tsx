import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Platform, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Collapsible from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/ui/scroll-view/parallax';
import Text from '@/components/ui/text';
import { useHideTabBar } from '@/hooks/useHideTabBar';

export default function ItemScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { itemId } = useLocalSearchParams();

  const navigation = useNavigation();

  useHideTabBar();

  console.log(navigation.canGoBack());
  useLayoutEffect(() => {
    console.log('itemId', navigation, router);
    navigation.setOptions({
      title: `Item: ${itemId}`,
      headerBackTitleVisible: false,
      headerShown: true,
      headerStyle: { backgroundColor: theme.colors.modalBackground },
    });
  }, [navigation, itemId, theme.colors.modalBackground]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <View style={styles.titleContainer}>
        <Text type="title">Explore</Text>
      </View>
      <Text>This app includes example code to help you get started.</Text>
      <Collapsible title="File-based routing">
        <Text>
          This app has two screens: <Text type="defaultSemiBold">app/(tabs)/index.tsx</Text> and{' '}
          <Text type="defaultSemiBold">app/(tabs)/explore.tsx</Text>
        </Text>
        <Text>
          The layout file in <Text type="defaultSemiBold">app/(tabs)/_layout.tsx</Text> sets up the
          tab navigator.
        </Text>
        <Link href="https://docs.expo.dev/router/introduction">
          <Text type="link">Learn more</Text>
        </Link>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Text>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <Text type="defaultSemiBold">w</Text> in the terminal running this project.
        </Text>
      </Collapsible>
      <Collapsible title="Images">
        <Text>
          For static images, you can use the <Text type="defaultSemiBold">@2x</Text> and{' '}
          <Text type="defaultSemiBold">@3x</Text> suffixes to provide files for different screen
          densities
        </Text>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <Link href="https://reactnative.dev/docs/images">
          <Text type="link">Learn more</Text>
        </Link>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <Text>
          Open <Text type="defaultSemiBold">app/_layout.tsx</Text> to see how to load{' '}
          <Text style={{ fontFamily: 'SpaceMono' }}>custom fonts such as this one.</Text>
        </Text>
        <Link href="https://docs.expo.dev/versions/latest/sdk/font">
          <Text type="link">Learn more</Text>
        </Link>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <Text>
          This template has light and dark mode support. The{' '}
          <Text type="defaultSemiBold">useColorScheme()</Text> hook lets you inspect what the user's
          current color scheme is, and so you can adjust UI colors accordingly.
        </Text>
        <Link href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text type="link">Learn more</Text>
        </Link>
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text type="defaultSemiBold">components/HelloWave.tsx</Text> component uses the powerful{' '}
          <Text type="defaultSemiBold">react-native-reanimated</Text> library to create a waving
          hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The <Text type="defaultSemiBold">components/ParallaxScrollView.tsx</Text> component
              provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const stylesheet = createStyleSheet({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
