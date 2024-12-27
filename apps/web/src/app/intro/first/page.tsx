import Image from 'next/image';

import FirstImage from 'public/images/intro/first-dark.png';

export default function FirstIntroScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Image src={FirstImage} alt="Intro" />
    </div>
  );
}
