'use client';
import { twMerge } from 'tailwind-merge';

import PageDotNavButton from '@/components/page-dot-nav-button';
import { useIntroPages } from '@/hooks/useIntroPages';
import { INTRO_PAGES } from '@/libs/constants';

export default function IntroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { numberOfPages, activePage, handlePressDot, transitionState } = useIntroPages(INTRO_PAGES);

  return (
    <>
      <div className="flex flex-col w-full items-center justify-between p-8 sm:p-20 ">
        <div
          className={twMerge(
            'flex flex-1 flex-col gap-1 items-center justify-center',
            transitionState,
          )}
        >
          <div className="flex flex-col mb-8 gap-4 sm:gap-8  sm:mb-12">
            <div className="text-xl whitespace-pre-line text-center font-extrabold sm:text-3xl leading-relaxed sm:leading-relaxed">
              {INTRO_PAGES[activePage].title}
            </div>
            {!!INTRO_PAGES[activePage].subtitle && (
              <div className="text-base text-tint  text-center  whitespace-pre-line  sm:text-2xl">
                {INTRO_PAGES[activePage].subtitle}
              </div>
            )}
          </div>
          <div className="flex flex-1">{children}</div>
        </div>
        <PageDotNavButton
          numberOfPages={numberOfPages}
          activePage={activePage}
          onPressDot={handlePressDot}
        />
      </div>
    </>
  );
}
