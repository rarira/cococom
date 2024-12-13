import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';

export const enum PortalHostNames {
  HOME = 'HomePortalHost',
  SEARCH = 'SearchPortalHost',
  ITEM_DETAILS = 'ItemDetailsPortalHost',
  RANKING = 'RankingPortalHost',
  SIGN_UP = 'SignUpPortalHost',
  PROFILE = 'ProfilePortalHost',
  SETTINGS = 'SettingsPortalHost',
}

export const MAX_MEMO_LENGTH = 140;

export const ITEM_DETAILS_MAX_COUNT = 999;

export const 할인마감임박잔여일수 = 3;

export const X_AXIS_HEIGHT = 40;

export const enum DiscountChannels {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ALL = 'all',
}

export const DiscountRotateButtonOptions: RotateButtonOption<DiscountChannels>[] = [
  { id: 0, text: '모두', value: DiscountChannels.ALL },
  { id: 1, text: '오프', fullText: '오프라인 매장', value: DiscountChannels.OFFLINE },
  { id: 2, text: '온', fullText: '온라인 몰', value: DiscountChannels.ONLINE },
];

export const INFINITE_SEARCH_PAGE_SIZE = 10;
export const INFINITE_WISHLIST_PAGE_SIZE = 20;
export const INFINITE_MEMO_PAGE_SIZE = 20;
export const INFINITE_COMMENT_PAGE_SIZE = 10;
export const RANKING_PAGE_SIZE = 50;

export const enum ItemDetailsTabNames {
  HISTORY = 'history',
  MEMO = 'memo',
  COMMENT = 'comment',
}
