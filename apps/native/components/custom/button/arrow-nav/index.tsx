import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/ui/button/icon';

interface ArrowNavButtonProps {
  iconProps: Omit<IconButtonProps['iconProps'], 'font'>;
  onPress: () => void;
  direction: 'left' | 'right';
  style?: IconButtonProps['style'];
}

const ArrowNavButton = memo(function ArrowNavButton({
  iconProps,
  onPress,
  direction,
  style,
}: ArrowNavButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <IconButton
      iconProps={{
        font: {
          type: 'MaterialIcon',
          name: `keyboard-arrow-${direction}`,
        },
        style: {
          left: -1,
        },
        ...iconProps,
      }}
      style={state => [styles.container, typeof style === 'function' ? style(state) : style]}
      onPress={onPress}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: theme.fontSize.xxl,
    height: theme.fontSize.xxl,
    borderRadius: theme.fontSize.xxl / 2,
    backgroundColor: `${theme.colors.lightShadow}88`,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default ArrowNavButton;
