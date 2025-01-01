'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { memo } from 'react';
import Autoplay from 'embla-carousel-autoplay';

import { ImagesForIntroCarousel } from '@/libs/types';

interface IntroCarouselProps {
  images: ImagesForIntroCarousel;
}

const IntroCarousel = memo(function IntroCarousel({ images }: IntroCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  return (
    <div ref={emblaRef} className="flex overflow-hidden flex-1">
      <div className="flex">
        {Object.keys(images).map(key => {
          return (
            <div key={key} className="grow-0 shrink-0 basis-full min-w-0">
              <div className="flex flex-col items-center justify-center gap-2 sm:gap-6">
                <Image src={images[key].image} alt="Intro" className="max-w-[calc(90%)]" />
                <div className="text-center whitespace-pre-line text-base font-medium text-tint  sm:text-xl">
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
