import { Supabase } from '@cococom/supabase/libs';
import Constants from 'expo-constants';
import { AppState } from 'react-native';

import { storage } from '@/libs/mmkv';
import 'react-native-url-polyfill/auto';

const { url, anonKey } = Constants.expoConfig?.extra?.supabase || {};

export const supabase = new Supabase(url, anonKey, {
  auth: {
    storage: {
      getItem: key => {
        return storage.getString(key) || null;
      },
      setItem: (key, value) => {
        storage.set(key, value);
      },
      removeItem: key => {
        storage.delete(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabaseClient = supabase.supabaseClient;

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabaseClient.auth.startAutoRefresh();
  } else {
    supabaseClient.auth.stopAutoRefresh();
  }
});
