'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { memo } from 'react';

import { ImagesForIntroCarousel } from '@/libs/types';

interface IntroCarouselProps {
  images: ImagesForIntroCarousel;
}

const IntroCarousel = memo(function IntroCarousel({ images }: IntroCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false });

  console.log(images);

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex">
        {Object.keys(images).map(key => {
          return (
            <div key={key} className="grow-0 shrink-0 basis-full min-w-0">
              <div className="flex flex-col items-center justify-center gap-8">
                <Image src={images[key].image} alt="Intro" />
                <div className="text-center whitespace-pre-line text-base  font-medium">
                  {images[key].text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default IntroCarousel;
