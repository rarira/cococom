import { memo } from 'react';

import { IntroPageProps } from '@/libs/type';

import CommonIntroPagerView, { ImagesForCommonIntroPagerView } from './common';

const Images: ImagesForCommonIntroPagerView = {
  light: {
    1: {
      image: require('@/assets/images/intro/fourth-light-1.png'),
      text: '상품 화면 내 댓글 탭',
    },
    2: { image: require('@/assets/images/intro/fourth-light-2.png'), text: '상품 화면 내 메모 탭' },
    3: {
      image: require('@/assets/images/intro/fourth-light-3.png'),
      text: '마이 탭 화면, 꾸욱 눌러 삭제 가능',
    },
  },
  dark: {
    1: {
      image: require('@/assets/images/intro/fourth-dark-1.png'),
      text: '상품 화면 내 댓글 탭',
    },
    2: { image: require('@/assets/images/intro/fourth-dark-2.png'), text: '상품 화면 내 메모 탭' },
    3: {
      image: require('@/assets/images/intro/fourth-dark-3.png'),
      text: '마이 탭 화면, 꾸욱 눌러 삭제 가능',
    },
  },
};

const FourthIntroPagerView = memo(function FourthIntroPagerView(props: IntroPageProps) {
  return <CommonIntroPagerView {...props} images={Images} />;
});

export default FourthIntroPagerView;
