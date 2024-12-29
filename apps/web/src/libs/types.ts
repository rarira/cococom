import { StaticImageData } from 'next/image';

export type ImagesForIntroCarousel = {
  [key: string]: {
    image: StaticImageData;
    text: string;
  };
};
