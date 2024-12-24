import { memo } from 'react';

import { IntroPageProps } from '@/libs/type';

import CommonIntroPagerView, { ImagesForCommonIntroPagerView } from './common';

const Images: ImagesForCommonIntroPagerView = {
  light: {
    1: {
      image: require('@/assets/images/intro/third-light-1.png'),
      text: '검색 탭내 별표 버튼 예',
    },
    2: { image: require('@/assets/images/intro/third-light-2.png'), text: '마이 탭 > 관심상품' },
    3: { image: require('@/assets/images/intro/third-light-3.png'), text: '홈 탭 > 알림센터' },
  },
  dark: {
    1: {
      image: require('@/assets/images/intro/third-dark-1.png'),
      text: '검색 탭내 별표 버튼 예',
    },
    2: { image: require('@/assets/images/intro/third-dark-2.png'), text: '마이 탭 > 관심상품' },
    3: { image: require('@/assets/images/intro/third-dark-3.png'), text: '홈 탭 > 알림센터' },
  },
};

const ThirdIntroPagerView = memo(function ThirdIntroPagerView(props: IntroPageProps) {
  return <CommonIntroPagerView {...props} images={Images} />;
});

export default ThirdIntroPagerView;
