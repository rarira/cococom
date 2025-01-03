import { memo } from 'react';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

import AppleDownloadSvg from '../../public/images/download_apple.svg';
import GoogleDownloadSvg from '../../public/images/download_google.svg';

type DownloadButtonsProps = {
  col?: boolean;
};

const DownloadButtons = memo(function DownloadButtons({ col }: DownloadButtonsProps) {
  return (
    <div
      className={twMerge(
        'flex flex-1 items-centerflex-row justify-center gap-4',
        col ? 'flex-col gap-8' : '',
      )}
    >
      <Image src={AppleDownloadSvg} alt={'Download Cococom on Apple App Store'} />
      <Image src={GoogleDownloadSvg} alt={'Download Cococom on Google Play Store'} />
    </div>
  );
});

export default DownloadButtons;
