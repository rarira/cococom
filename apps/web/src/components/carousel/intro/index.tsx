'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { memo, useEffect } from 'react';

interface IntroCarouselProps {}

const IntroCarousel = memo(function IntroCarousel({}: IntroCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex">
        <div className="grow-0 shrink-0 basis-full  min-w-0 border border-red-500">Slide1</div>
        <div className="grow-0 shrink-0 basis-full  min-w-0 border border-red-500">Slide2</div>
        <div className="grow-0 shrink-0 basis-full  min-w-0 border border-red-500">Slide3</div>
      </div>
    </div>
  );
});

export default IntroCarousel;
