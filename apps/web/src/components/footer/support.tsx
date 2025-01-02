import Link from 'next/link';
import { memo } from 'react';

interface SupportFooterProps {}

const SupportFooter = memo(function SupportFooter({}: SupportFooterProps) {
  return (
    <div className="text-xs sm:text-sm">
      이메일 문의 :{' '}
      <Link href="mailto:admin@cococom.kr" className="underline">
        admin@cococom.kr
      </Link>
    </div>
  );
});

export default SupportFooter;
