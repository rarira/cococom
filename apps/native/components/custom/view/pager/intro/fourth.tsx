import { memo } from 'react';
import { FOURTH_INTRO_PAGES_TEXT } from '@cococom/libs/constants';

import { IntroPageProps } from '@/libs/type';

import CommonIntroPagerView, { ImagesForCommonIntroPagerView } from './common';

const Images: ImagesForCommonIntroPagerView = {
  light: {
    1: {
      image: require('@/assets/images/intro/fourth-light-1.png'),
      text: FOURTH_INTRO_PAGES_TEXT[1].text,
    },
    2: {
      image: require('@/assets/images/intro/fourth-light-2.png'),
      text: FOURTH_INTRO_PAGES_TEXT[2].text,
    },
    3: {
      image: require('@/assets/images/intro/fourth-light-3.png'),
      text: FOURTH_INTRO_PAGES_TEXT[3].text,
    },
  },
  dark: {
    1: {
      image: require('@/assets/images/intro/fourth-dark-1.png'),
      text: FOURTH_INTRO_PAGES_TEXT[1].text,
    },
    2: {
      image: require('@/assets/images/intro/fourth-dark-2.png'),
      text: FOURTH_INTRO_PAGES_TEXT[2].text,
    },
    3: {
      image: require('@/assets/images/intro/fourth-dark-3.png'),
      text: FOURTH_INTRO_PAGES_TEXT[3].text,
    },
  },
};

const FourthIntroPagerView = memo(function FourthIntroPagerView(props: IntroPageProps) {
  return <CommonIntroPagerView {...props} images={Images} />;
});

export default FourthIntroPagerView;
