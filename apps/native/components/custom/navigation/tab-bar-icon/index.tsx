// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, type ComponentProps } from 'react';

const TabBarIcon = memo(function TabBarIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return <Ionicons style={[{ marginBottom: -3 }, style]} {...rest} />;
});

export default TabBarIcon;
