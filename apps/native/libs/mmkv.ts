import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'SEARCH_HISTORY',
};
