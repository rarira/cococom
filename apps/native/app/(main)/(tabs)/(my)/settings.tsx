import { router } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Divider from '@/components/ui/divider';
import ToggleSwitch from '@/components/ui/switch/\btoggle';
import { useUserStore } from '@/store/user';

export default function ProfileScreen() {
  const { styles } = useStyles(stylesheet);
  const user = useUserStore(state => state.user);

  const [checked, setChecked] = useState(false);

  const handleToggle = useCallback(() => {
    setChecked(prev => !prev);
  }, []);

  useLayoutEffect(() => {
    if (!user) router.navigate('/(my)');
  }, [user]);

  return (
    <ScreenContainerView withHeader>
      <ToggleSwitch checked={checked} onToggle={handleToggle} />
      <Divider style={styles.divider} />
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  divider: {
    marginVertical: theme.spacing.xl * 2,
  },
}));
