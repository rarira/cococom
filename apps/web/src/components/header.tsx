'use client';
import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { GoDownload } from 'react-icons/go';

import LogoImage from 'public/images/cococom.png';

const Header = memo(function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname === '/' || searchParams.get('webview') === 'true') return null;

  return (
    <header className="flex items-center justify-between h-fit w-full mt-2 px-4 sm:max-w-[1024px] mx-auto">
      <nav className="flex flex-row justify-start items-center gap-4 sm:gap-12">
        <Link href="/" className="bg-white rounded-lg">
          <Image src={LogoImage} alt="cococom logo" className="h-12 w-16 sm:h-24 sm:w-32" />
        </Link>
        <Link href="/intro" className="text-sm sm:text-base font-semibold">
          서비스 소개
        </Link>
      </nav>
      <Link href="/download" className="flex text-sm sm:text-base font-semibold items-center gap-2">
        <GoDownload className="inline-block" />
        다운로드
      </Link>
    </header>
  );
});

export default Header;
