'use client';

import { memo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { useSearchParams } from 'next/navigation';

import AccordionItem from '@/components/accordion/item';

import CompanyFooter from './company';
import LawFooter from './law';
import SupportFooter from './support';

const Footer = memo(function Footer() {
  const searchParams = useSearchParams();

  if (searchParams.get('webview') === 'true') {
    return null;
  }

  return (
    <footer className="flex flex-col w-full justify-between text-xs text-slate-500 sm:text-base pt-2 sm:pt12 mt-4 bg-black">
      <div className="flex flex-col w-full px-4 sm:max-w-[1024px] mx-auto">
        <Accordion.Root type="single" collapsible>
          <AccordionItem itemValue="item-1" triggerText="사업자 정보">
            <CompanyFooter />
          </AccordionItem>
          <AccordionItem itemValue="item-2" triggerText="법적 고지사항">
            <LawFooter />
          </AccordionItem>
          <AccordionItem itemValue="item-3" triggerText="고객 지원">
            <SupportFooter />
          </AccordionItem>
        </Accordion.Root>
        <div className="text-xs sm:text-base mt-2">© Rarira Studio</div>
      </div>
    </footer>
  );
});

export default Footer;
