import * as Accordion from '@radix-ui/react-accordion';
import { memo } from 'react';
import { GoChevronDown } from 'react-icons/go';

interface AccordionTriggerProps {}

const AccordionTrigger = memo(function AccordionTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Accordion.Trigger className="flex flex-row justify-start items-center group text-sm  sm:text-base font-semibold">
      {children}
      <GoChevronDown className="w-4 sm:w-6 transition-transform duration-300 ease-in-out-back group-data-[state=open]:rotate-180" />
    </Accordion.Trigger>
  );
});

export default AccordionTrigger;
