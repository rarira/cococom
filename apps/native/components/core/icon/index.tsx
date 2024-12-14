import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { IconProps as ExpoIconProps } from '@expo/vector-icons/build/createIconSet';
import { memo } from 'react';
import { useStyles } from 'react-native-unistyles';

type IconType = 'MaterialIcon' | 'FontAwesomeIcon' | 'Ionicon';

export interface IconProps extends Omit<ExpoIconProps<IconType>, 'name'> {
  font:
    | {
        type: 'MaterialIcon';
        name: keyof typeof MaterialIcons.glyphMap;
      }
    | {
        type: 'FontAwesomeIcon';
        name: keyof typeof FontAwesome.glyphMap;
      }
    | {
        type: 'Ionicon';
        name: keyof typeof Ionicons.glyphMap;
      };
}

const Icon = memo(function Icon({ font, ...restProps }: IconProps) {
  const { theme } = useStyles();

  const IconComponet =
    font.type === 'MaterialIcon'
      ? MaterialIcons
      : font.type === 'FontAwesomeIcon'
        ? FontAwesome
        : Ionicons;

  return <IconComponet name={font.name as any} size={theme.fontSize.md} {...restProps} />;
});

export default Icon;
