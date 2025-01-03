'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { twMerge } from 'tailwind-merge';
import { Suspense } from 'react';

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const params = useSearchParams();
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const isTerms = pathname === '/statements/terms';
  const isPrivacy = pathname === '/statements/privacy';

  const isRealMobile = params.get('webview') === 'true' || isMobile;

  return (
    <div
      className={twMerge(
        'flex flex-row w-full gap-4 text-sm sm:text-base pt-4 sm:pt-8',
        isRealMobile && 'flex-col',
      )}
    >
      <ul
        className={twMerge(
          'flex flex-col gap-2 min-w-fit',
          isRealMobile && 'flex-row  justify-end',
        )}
      >
        <li className={isTerms ? 'text-tint3  hover:text-tint' : 'text-gray-400 hover:text-tint'}>
          <Link href={`/statements/terms?${params.toString()}`}>이용약관</Link>
        </li>
        <li className={isPrivacy ? 'text-tint3  hover:text-tint' : 'text-gray-400 hover:text-tint'}>
          <Link href={`/statements/privacy?${params.toString()}`}>개인정보처리방침</Link>
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

export default function StatementsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <Layout>{children}</Layout>
    </Suspense>
  );
}
