import { FOURTH_INTRO_PAGES_TEXT } from '@cococom/libs/constants';

import IntroCarousel from '@/components/carousel/intro';
import Image1 from 'public/images/intro/fourth-dark-1.png';
import Image2 from 'public/images/intro/fourth-dark-2.png';
import Image3 from 'public/images/intro/fourth-dark-3.png';
import { ImagesForIntroCarousel } from '@/libs/types';

const Images: ImagesForIntroCarousel = {
  1: {
    image: Image1,
    text: FOURTH_INTRO_PAGES_TEXT[1].text,
  },
  2: {
    image: Image2,
    text: FOURTH_INTRO_PAGES_TEXT[2].text,
  },
  3: {
    image: Image3,
    text: FOURTH_INTRO_PAGES_TEXT[3].text,
  },
};

export default function FourthIntroScreen() {
  return <IntroCarousel images={Images} />;
}