import { memo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import IconButton, { IconButtonProps } from '@/components/ui/button/icon';

interface SwipeableActionButtonProps extends IconButtonProps {}

const SwipeableActionButton = memo(function SwipeableActionButton(
  props: SwipeableActionButtonProps,
) {
  const { styles } = useStyles(stylesheet);

  return <IconButton {...props} />;
});

const stylesheet = createStyleSheet(theme => ({
  container: {},
}));

export default SwipeableActionButton;
