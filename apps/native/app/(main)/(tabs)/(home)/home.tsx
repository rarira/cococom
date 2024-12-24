import { useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import CategorySectorList from '@/components/custom/list/category-sector';
import ScreenContainerView from '@/components/custom/view/container/screen';
import HistoryInfoBanner from '@/components/custom/view/history-banner';
import HeaderRightNotiCenterButton from '@/components/custom/button/header/right/noti-center';

export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);

  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);

  return (
    <ScreenContainerView withBottomTabBar scollable>
      <View style={styles.header}>
        <HeaderRightNotiCenterButton />
      </View>
      <HistoryInfoBanner totalDiscounts={totalDiscounts} />
      <CategorySectorList setTotalDiscounts={setTotalDiscounts} />
    </ScreenContainerView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.md,
  },
}));
