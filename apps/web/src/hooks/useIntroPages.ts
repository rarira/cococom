import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { wait } from '@/libs/utils';

export function useIntroPages(introPages: readonly { path: string }[]) {
  const [transitionState, setTransitionState] = useState('fade-enter');

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    introPages.forEach(page => {
      router.prefetch(page.path);
    });
  }, []);

  const activePage = useMemo(
    () => introPages.findIndex(page => page.path === pathname),
    [introPages, pathname],
  );

  const handlePressDot = useCallback(
    async (page: number) => {
      setTransitionState('fade-exit');
      await wait(500);
      router.push(introPages[page].path);
      await wait(500);
      setTransitionState('fade-enter');
    },
    [introPages],
  );

  return {
    pathname,
    numberOfPages: introPages.length,
    activePage,
    handlePressDot,
    transitionState,
  };
}
