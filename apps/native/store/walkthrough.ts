import { createWithEqualityFn as create } from 'zustand/traditional';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS, zustandStorage } from '@/libs/mmkv';

function createDefaultFlags<T extends Record<string, boolean>>(keys: readonly (keyof T)[]): T {
  const result: Partial<Record<string, boolean>> = {};
  for (const key of keys) {
    result[key as string] = false;
  }
  return result as T;
}

const flagKeys = ['intro'] as const;

type WalkThroughFlags = Record<(typeof flagKeys)[number], boolean>;

interface WalkthroughState {
  flags: WalkThroughFlags;
  setFlags: (key: (typeof flagKeys)[number], value: boolean) => void;
  init: () => void;
}

export const useWalkthroughStore = create(
  persist<WalkthroughState>(
    set => ({
      flags: createDefaultFlags<WalkThroughFlags>(flagKeys),
      setFlags: (key, value) => set(state => ({ flags: { ...state.flags, [key]: value } })),
      init: () => set(_set => ({ flags: createDefaultFlags<WalkThroughFlags>(flagKeys) })),
    }),
    {
      name: STORAGE_KEYS.STORE.WALKTHROUGH,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
