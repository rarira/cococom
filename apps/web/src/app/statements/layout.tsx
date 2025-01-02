'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { twMerge } from 'tailwind-merge';

export default function StatementsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const isTerms = pathname === '/statements/terms';
  const isPrivacy = pathname === '/statements/privacy';

  return (
    <div
      className={twMerge(
        'flex flex-row w-full gap-4 text-sm sm:text-base pt-4 sm:pt-8',
        isMobile && 'flex-col',
      )}
    >
      <ul className={twMerge('flex flex-col gap-2 min-w-fit', isMobile && 'flex-row  justify-end')}>
        <li className={twMerge(' text-gray-400 hover:text-tint', isTerms && 'text-tint3')}>
          <Link href="/statements/terms">이용약관</Link>
        </li>
        <li className={twMerge(' text-gray-400  hover:text-tint', isPrivacy && 'text-tint3')}>
          <Link href="/statements/privacy">개인정보처리방침</Link>
        </li>
      </ul>
      <div className="flex flex-col  gap-2 sm:gap-4">
        <h2 className="font-bold text-lg sm:text-2xl">
          {isTerms ? '서비스 이용약관' : isPrivacy ? '개인정보처리방침' : ''}
        </h2>
        {children}
      </div>
    </div>
  );
}
