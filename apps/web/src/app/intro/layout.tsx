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
      <div className="grid grid-rows-[1fr_100px] items-center justify-center min-h-dvh p-8 pb-0 sm:p-20">
        <main
          className={twMerge(
            'gap-8 row-start-1 items-center justify-items-center',
            transitionState,
          )}
        >
          <div className="flex flex-col mb-8 gap-4">
            <div className="text-xl whitespace-pre-line text-center  font-extrabold">
              {INTRO_PAGES[activePage].title}
            </div>
            {!!INTRO_PAGES[activePage].subtitle && (
              <div className="text-base text-tint  text-center  whitespace-pre-line">
                {INTRO_PAGES[activePage].subtitle}
              </div>
            )}
          </div>
          {children}
        </main>
        <div className="row-start-2">
          <PageDotNavButton
            numberOfPages={numberOfPages}
            activePage={activePage}
            onPressDot={handlePressDot}
          />
        </div>
      </div>
    </>
  );
}
