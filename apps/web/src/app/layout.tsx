import type { Metadata } from 'next';

import { Suspense } from 'react';
import { Noto_Sans_KR } from 'next/font/google';

import './globals.css';

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css';

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css';

// used for rendering equations (optional)
import 'katex/dist/katex.min.css';

import Header from '@/components/header';
import Footer from '@/components/footer';

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="코코컴" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${notoSansKr.className} antialiased flex flex-1 flex-col w-full justify-items-center`}
      >
        <Suspense>
          <Header />
        </Suspense>
        <main className="flex flex-1 overflow-auto min-h-[calc(80dvh)] sm:max-w-[1024px] px-4 mx-auto">
          {children}
        </main>
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
