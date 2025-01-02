import { memo, ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';

import AccordionTrigger from './trigger';

interface AccordionItemProps {
  itemValue: string;
  triggerText: string;
  children: ReactNode;
}

const AccordionItem = memo(function AccordionItem({
  itemValue,
  triggerText,
  children,
}: AccordionItemProps) {
  return (
    <Accordion.Item value={itemValue} className="flex flex-col py-2">
      <AccordionTrigger>{triggerText}</AccordionTrigger>
      <Accordion.Content className="py-2">{children}</Accordion.Content>
    </Accordion.Item>
  );
});

export default AccordionItem;
