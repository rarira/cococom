import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';
import { ObjectValues } from '@/libs/type';
import Util from '@/libs/util';

export const PORTAL_HOST_NAMES = {
  HOME: 'HomePortalHost',
  SEARCH: 'SearchPortalHost',
  ITEM_DETAILS: 'ItemDetailsPortalHost',
  RANKING: 'RankingPortalHost',
  SIGN_UP: 'SignUpPortalHost',
  PROFILE: 'ProfilePortalHost',
  SETTINGS: 'SettingsPortalHost',
} as const;

export type PortalHostNames = ObjectValues<typeof PORTAL_HOST_NAMES>;

export const MAX_MEMO_LENGTH = 140;

export const ITEM_DETAILS_MAX_COUNT = 999;

export const 할인마감임박잔여일수 = 3;

export const X_AXIS_HEIGHT = 40;

export const DISCOUNT_CHANNELS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  ALL: 'all',
} as const;

export type DiscountChannels = ObjectValues<typeof DISCOUNT_CHANNELS>;

export const DiscountRotateButtonOptions: RotateButtonOption<DiscountChannels>[] = [
  { id: 0, text: '모두', value: DISCOUNT_CHANNELS.ALL },
  { id: 1, text: '오프', fullText: '오프라인 매장', value: DISCOUNT_CHANNELS.OFFLINE },
  { id: 2, text: '온', fullText: '온라인 몰', value: DISCOUNT_CHANNELS.ONLINE },
];

export const INFINITE_SEARCH_PAGE_SIZE = 10;
export const INFINITE_WISHLIST_PAGE_SIZE = 20;
export const INFINITE_MEMO_PAGE_SIZE = 20;
export const INFINITE_COMMENT_PAGE_SIZE = 10;
export const RANKING_PAGE_SIZE = 50;

export const ITEM_DETAILS_TAB_NAMES = {
  HISTORY: 'history',
  MEMO: 'memo',
  COMMENT: 'comment',
} as const;

export type ItemDetailsTabNames = ObjectValues<typeof ITEM_DETAILS_TAB_NAMES>;

export const HOMEPAGE_HOST = Util.isDevClient() ? 'http://localhost:3000' : 'https://cococom.kr';
