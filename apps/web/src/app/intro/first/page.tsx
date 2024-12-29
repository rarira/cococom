import Image from 'next/image';

import FirstImage from 'public/images/intro/first-dark.png';

export default function FirstIntroScreen() {
  return (
    <div className="items-center justify-center">
      <Image src={FirstImage} alt="first intro image" />
    </div>
  );
}
