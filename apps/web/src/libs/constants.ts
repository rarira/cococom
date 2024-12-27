import { INTRO_PAGES as INTRO_PAGES_TEXT } from '@cococom/libs/constants';

export const INTRO_PAGES = [
  { path: '/intro/first' },
  { path: '/intro/second' },
  { path: '/intro/third' },
  { path: '/intro/fourth' },
].map((page, index) => ({ ...page, ...INTRO_PAGES_TEXT[index] }));
