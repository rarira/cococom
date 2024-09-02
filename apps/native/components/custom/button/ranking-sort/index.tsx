import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/ui/button/icon';
import { IconProps } from '@/components/ui/icon';

interface RankingSortButtonProps extends Omit<IconButtonProps, 'iconProps'> {
  iconProps?: Omit<IconProps, 'font'>;
}

const RankingSortButton = memo(function RankingSortButton({
  text,
  onPress,
  style,
  textStyle,
  iconProps,
  ...restProps
}: RankingSortButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <IconButton
      iconProps={{
        font: { type: 'MaterialIcon', name: 'sort' },
        color: theme.colors.typography,
        size: theme.fontSize.lg,
        ...iconProps,
      }}
      text={text}
      onPress={onPress}
      style={state => [styles.button, typeof style === 'function' ? style(state) : style]}
      textStyle={[styles.buttonText, textStyle]}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.normal * 1.5,
    color: theme.colors.typography,
  },
}));

export default RankingSortButton;
