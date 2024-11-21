import { useState } from 'react';
import { Button } from 'react-native';

import CategorySectorList from '@/components/custom/list/category-sector';
import ScreenContainerView from '@/components/custom/view/container/screen';
import HistoryInfoBanner from '@/components/custom/view/history-banner';

export default function HomeScreen() {
  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);

  return (
    <ScreenContainerView withBottomTabBar>
      <Button
        title="Press me"
        onPress={() => {
          throw new Error('Hello, again, Sentry!');
        }}
      />

      <HistoryInfoBanner totalDiscounts={totalDiscounts} />
      <CategorySectorList setTotalDiscounts={setTotalDiscounts} />
    </ScreenContainerView>
  );
}
