import Link from 'next/link';
import { memo } from 'react';

interface LawFooterProps {}

const LawFooter = memo(function LawFooter({}: LawFooterProps) {
  return (
    <div className="text-xs sm:text-sm">
      <ul className="flex flex-col gap-1">
        <li>
          <Link href="/statements/terms">이용약관</Link>
        </li>
        <li>
          <Link href="/statements/privacy">개인정보처리방침</Link>
        </li>
      </ul>
    </div>
  );
});

export default LawFooter;
