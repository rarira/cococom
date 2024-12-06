import { useState } from 'react';

import ScreenContainerView from '@/components/custom/view/container/screen';
import Text from '@/components/core/text';

export default function NotiCenterScreen() {
  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);

  return (
    <ScreenContainerView withBottomTabBar>
      <Text>Noti-center</Text>
    </ScreenContainerView>
  );
}
