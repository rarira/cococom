import Image from 'next/image';
import Link from 'next/link';
import { GoMail } from 'react-icons/go';

import DownloadButtons from '@/components/download-buttons';
import { INTRO_PAGES } from '@/libs/constants';
import LogoImage from 'public/images/cococom.png';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-between p-4 sm:p-12 gap-8 sm:gap-36 ">
      <div className="flex flex-1 flex-col gap-4 items-center justify-center">
        <div className="text-costcoBlue text-2xl sm:text-5xl font-extrabold text-center">
          코스트코 쇼핑전엔
        </div>
        <Image
          src={LogoImage}
          alt="Cococom Logo"
          priority
          className="img-center max-w-[calc(70%)] sm:max-w-md"
        />
        <p className="text-costcoRed text-xl sm:text-2xl font-bold text-center leading-6 sm:leading-10">
          오프라인 매장 할인에
          <br />
          온라인 할인 정보까지
          <br />
          매일 업데이트
        </p>
        <Link
          href={INTRO_PAGES[0].path}
          className="bg-costcoBlue text-white text-xl sm:text-2xl font-bold py-3 px-5 sm:py-4 sm:px-8 rounded-lg hover:bg-opacity-80 mt-8 text-center"
        >
          자세히 알아보기
        </Link>
      </div>
      <div className="flex items-center justify-center px-4  sm:px-2 pt-2">
        <DownloadButtons />
      </div>
      <footer className="flex flex-row w-full justify-between text-xs text-center text-slate-400 sm:text-base">
        <div>©2025 Cococom.kr</div>
        <Link href="/">Terms & Conditions</Link>
        <Link href="mailto:admin@cococom.kr">
          <GoMail />
        </Link>
      </footer>
    </div>
  );
}
