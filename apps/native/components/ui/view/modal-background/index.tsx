import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

function ModalBackgroundView() {
  const { styles } = useStyles(stylesheet);

  return <View style={styles.container} />;
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.modalBackground,
  },
}));

export default ModalBackgroundView;
