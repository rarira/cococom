import { memo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';

interface FooterProps {}

const Footer = memo(function Footer({}: FooterProps) {
  return (
    <footer className="flex flex-row w-full justify-between text-xs text-center text-slate-400 sm:text-base border-t mt-6 sm:mt-12 border-tint3">
      <Accordion.Root type="single" defaultValue="item-1" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>©2025 Cococom.kr</Accordion.Trigger>
          <Accordion.Content>
            <a href="/">Terms & Conditions</a>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </footer>
  );
});

export default Footer;
