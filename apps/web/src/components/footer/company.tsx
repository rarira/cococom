import Link from 'next/link';
import { memo } from 'react';

const CompanyFooter = memo(function CompanyFooter() {
  return (
    <div className="text-xs sm:text-sm">
      라리라스튜디오 | 대표자 : 박인성 | 개인정보보호책임자 : 박인성(
      <Link href="mailto:admin@cococom.kr" className="underline">
        admin@cococom.kr
      </Link>
      ) | 사업자등록번호 : 275-02-01650
    </div>
  );
});

export default CompanyFooter;
