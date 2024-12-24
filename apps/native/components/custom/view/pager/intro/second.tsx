import { memo } from 'react';

import { IntroPageProps } from '@/libs/type';

import CommonIntroPagerView, { ImagesForCommonIntroPagerView } from './common';

const Images: ImagesForCommonIntroPagerView = {
  light: {
    1: {
      image: require('@/assets/images/intro/second-light-1.png'),
      text: '상품 목록에서 모두 버튼\n온라인/오프라인 상품 모두 표시',
    },
    2: {
      image: require('@/assets/images/intro/second-light-2.png'),
      text: '상품 목록에서 오프 버튼\n오프라인 상품만 표시',
    },
    3: {
      image: require('@/assets/images/intro/second-light-3.png'),
      text: '마이 탭 > 설정 메뉴에서 순서 변경 가능',
    },
  },
  dark: {
    1: {
      image: require('@/assets/images/intro/second-dark-1.png'),
      text: '상품 목록에서 모두 버튼\n온라인/오프라인 상품 모두 표시',
    },
    2: {
      image: require('@/assets/images/intro/second-dark-2.png'),
      text: '상품 목록에서 오프 버튼\n오프라인 상품만 표시',
    },
    3: {
      image: require('@/assets/images/intro/second-dark-3.png'),
      text: '마이 탭 > 설정 메뉴에서 순서 변경 가능',
    },
  },
};

const SecondIntroPagerView = memo(function SecondIntroPagerView(props: IntroPageProps) {
  return <CommonIntroPagerView {...props} images={Images} />;
});

export default SecondIntroPagerView;
