import { useState } from 'react';

import CategorySectorList from '@/components/custom/list/category-sector';
import ScreenContainerView from '@/components/custom/view/container/screen';
import HistoryInfoBanner from '@/components/custom/view/history-banner';

export default function HomeScreen() {
  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);

  return (
    <ScreenContainerView withBottomTabBar>
      <HistoryInfoBanner totalDiscounts={totalDiscounts} />
      <CategorySectorList setTotalDiscounts={setTotalDiscounts} />
    </ScreenContainerView>
  );
}
