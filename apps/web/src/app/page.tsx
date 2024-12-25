import Image from "next/image";
import Link from "next/link";

import DownloadButtons from "@/components/download-buttons";

import LogoImage from "../../public/images/cococom.png";

export default function Home() {
  return (
    <div className="grid grid-rows-[10px_1fr_10px] items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <main className="gap-8 row-start-2 items-center justify-items-center">
        <div className="text-costcoBlue text-3xl sm:text-5xl font-extrabold text-center">
          코스트코 쇼핑전엔
        </div>
        <Image
          src={LogoImage}
          alt="Logo"
          className="flex-1 img-center sm:max-w-md"
        />
        <p className="text-costcoRed text-xl sm:text-2xl font-bold text-center leading-6 sm:leading-10">
          오프라인 매장 할인에
          <br />
          온라인 할인 정보까지
          <br />
          매일 업데이트
        </p>
        <div className="flex flex-1 justify-center">
          <Link
            href="/intro"
            className="bg-costcoBlue text-white text-xl sm:text-2xl font-bold py-3 px-5 sm:py-4 sm:px-8 rounded-lg hover:bg-opacity-80 mt-8 text-center"
          >
            자세히 알아보기
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6  items-center justify-center">
        <DownloadButtons />
      </footer>
    </div>
  );
}
