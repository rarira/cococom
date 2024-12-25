import type { Metadata } from "next";

import { Noto_Sans_KR } from "next/font/google";
// import localFont from "next/font/local";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "코코컴",
  description: "코스트코 쇼핑 할땐 코코컴",
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
      <body className={`${notoSansKr.className}  antialiased`}>{children}</body>
    </html>
  );
}
