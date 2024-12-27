import { memo } from 'react';
import { THIRD_INTRO_PAGES_TEXT } from '@cococom/libs/constants';

import { IntroPageProps } from '@/libs/type';

import CommonIntroPagerView, { ImagesForCommonIntroPagerView } from './common';

const Images: ImagesForCommonIntroPagerView = {
  light: {
    1: {
      image: require('@/assets/images/intro/third-light-1.png'),
      text: THIRD_INTRO_PAGES_TEXT[1].text,
    },
    2: {
      image: require('@/assets/images/intro/third-light-2.png'),
      text: THIRD_INTRO_PAGES_TEXT[2].text,
    },
    3: {
      image: require('@/assets/images/intro/third-light-3.png'),
      text: THIRD_INTRO_PAGES_TEXT[3].text,
    },
  },
  dark: {
    1: {
      image: require('@/assets/images/intro/third-dark-1.png'),
      text: THIRD_INTRO_PAGES_TEXT[1].text,
    },
    2: {
      image: require('@/assets/images/intro/third-dark-2.png'),
      text: THIRD_INTRO_PAGES_TEXT[2].text,
    },
    3: {
      image: require('@/assets/images/intro/third-dark-3.png'),
      text: THIRD_INTRO_PAGES_TEXT[3].text,
    },
  },
};

const ThirdIntroPagerView = memo(function ThirdIntroPagerView(props: IntroPageProps) {
  return <CommonIntroPagerView {...props} images={Images} />;
});

export default ThirdIntroPagerView;
