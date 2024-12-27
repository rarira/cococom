import { memo } from 'react';
import { GoChevronRight } from 'react-icons/go';
import { GoChevronLeft } from 'react-icons/go';
import { useMediaQuery } from 'react-responsive';

interface PageDotNavButtonProps {
  numberOfPages: number;
  activePage: number;
  // eslint-disable-next-line no-unused-vars
  onPressDot: (page: number) => void;
}

const PageDotNavButton = memo(function PageDotNavButton({
  numberOfPages,
  activePage,
  onPressDot,
}: PageDotNavButtonProps) {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const ChevronIconSize = isMobile ? 24 : 40;

  return (
    <div className="flex flex-row justify-center items-center gap-4 sm:gap-8">
      <div className="flex min-w-12 justify-end">
        {activePage === 0 ? (
          <></>
        ) : (
          <GoChevronLeft onClick={() => onPressDot(activePage - 1)} size={ChevronIconSize} />
        )}
      </div>

      <div className="flex flex-row justify-center items-center gap-3">
        {Array.from({ length: numberOfPages }, (_, i) => {
          return (
            <button
              key={i}
              className={
                i === activePage
                  ? 'w-3 h-3 rounded-xl bg-tint sm:w-5 sm:h-5'
                  : 'w-3 h-3 rounded-xl bg-lightShadow sm:w-5 sm:h-5'
              }
              onClick={() => onPressDot(i)}
            />
          );
        })}
      </div>
      <div className="flex  min-w-12 justify-start">
        {activePage === numberOfPages - 1 ? null : (
          <GoChevronRight onClick={() => onPressDot(activePage + 1)} size={ChevronIconSize} />
        )}
      </div>
    </div>
  );
});

export default PageDotNavButton;
