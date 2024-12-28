import type { Metadata } from 'next';

import { Noto_Sans_KR } from 'next/font/google';

// import localFont from "next/font/local";
import './globals.css';
import Header from '@/components/header';

const notoSansKr = Noto_Sans_KR({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '코코컴',
  description: '코스트코 쇼핑전엔 코코컴',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Add Ituens id
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="apple-itunes-app" content="app-id=<ITUNES_ID>" />
      </head>
      <body
        className={`${notoSansKr.className} antialiased flex flex-1 flex-col w-full sm:max-w-[1024px] justify-items-center mx-auto min-h-dvh`}
      >
        <Header />
        <main className="flex flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
