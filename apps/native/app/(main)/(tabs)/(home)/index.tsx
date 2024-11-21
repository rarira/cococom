import { useState } from 'react';
import { Button } from 'react-native';

import CategorySectorList from '@/components/custom/list/category-sector';
import ScreenContainerView from '@/components/custom/view/container/screen';
import HistoryInfoBanner from '@/components/custom/view/history-banner';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export default function HomeScreen() {
  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);
  const { reportToSentry } = useErrorHandler();

  return (
    <ScreenContainerView withBottomTabBar>
      <Button
        title="Press me"
        onPress={() => {
          try {
            throw new Error('Hello, again, Sentry!');
          } catch (error) {
            reportToSentry(error as Error);
          }
        }}
      />

      <HistoryInfoBanner totalDiscounts={totalDiscounts} />
      <CategorySectorList setTotalDiscounts={setTotalDiscounts} />
    </ScreenContainerView>
  );
}
