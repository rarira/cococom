"use client";
import { memo } from "react";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

import AppleDownloadSvg from "../../public/images/download_apple.svg";
import GoogleDownloadSvg from "../../public/images/download_google.svg";

const DownloadButtons = memo(function DownloadButtons() {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  console.log("isMobile", isMobile);
  return (
    <div className="flex flex-1 flex-row items-centerflex-row justify-center gap-4">
      <Image
        src={AppleDownloadSvg}
        alt={"Download Cococom on Apple App Store"}
        height={isMobile ? 32 : 64}
      />
      <Image
        src={GoogleDownloadSvg}
        alt={"Download Cococom on Google Play Store"}
        height={isMobile ? 32 : 64}
      />
    </div>
  );
});

export default DownloadButtons;
