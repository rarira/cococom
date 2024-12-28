'use client';
import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoDownload } from 'react-icons/go';

import LogoImage from 'public/images/logo.png';

const Header = memo(function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between h-16 w-full mt-2 px-2">
      <nav className="flex flex-row justify-start items-center gap-4 sm:gap-12">
        <Link href="/">
          <Image src={LogoImage} alt="cococom logo" className="rounded-lg" />
        </Link>
        <Link href="/intro" className="text-base font-semibold">
          서비스 소개
        </Link>
      </nav>
      {pathname === '/' ? null : (
        <Link href="/download" className="flex text-base font-semibold items-center gap-2">
          <GoDownload className="inline-block" />
          다운로드
        </Link>
      )}
    </header>
  );
});

export default Header;
