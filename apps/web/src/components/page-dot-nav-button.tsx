import { memo } from 'react';

interface PageDotNavButtonProps {
  numberOfPages: number;
  activePage: number;
  onPressDot?: (page: number) => void;
}

const PageDotNavButton = memo(function PageDotNavButton({
  numberOfPages,
  activePage,
  onPressDot,
}: PageDotNavButtonProps) {
  return (
    <div className="flex flex-row justify-center items-center gap-3">
      {Array.from({ length: numberOfPages }, (_, i) => {
        return (
          <button
            key={i}
            className={
              i === activePage ? 'w-3 h-3 rounded-xl bg-tint' : 'w-3 h-3 rounded-xl bg-lightShadow'
            }
            onClick={() => onPressDot?.(i)}
          />
        );
      })}
    </div>
  );
});

export default PageDotNavButton;
