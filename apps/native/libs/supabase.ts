import { Supabase } from '@cococom/supabase/libs';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';
import axios from 'axios';

import { storage } from '@/libs/mmkv';

let url = Constants.expoConfig?.extra?.supabase?.url;
const supabaseEnv = Constants.expoConfig?.extra?.supabase?.env;

if (supabaseEnv === 'LOCAL' && Platform.OS === 'android') {
  url = 'http://10.0.2.2:54321';
}
export const supabase: Supabase = new Supabase(
  url,
  Constants.expoConfig?.extra?.supabase?.anonKey,
  {
    auth: {
      storage:
        typeof window !== 'undefined'
          ? {
              getItem: (key: string) => {
                return storage.getString(key) || null;
              },
              setItem: (key: string, value: string) => {
                storage.set(key, value);
              },
              removeItem: (key: string) => {
                storage.delete(key);
              },
            }
          : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (url, config) => {
        try {
          const result = await axios({
            url: url as string,
            method: config?.method,
            headers: config?.headers as any,
            data: config?.body,
          });

          const responseBody = JSON.stringify(result.data);

          const headers = new Headers();
          Object.entries(result.headers).forEach(([key, value]) => {
            headers.append(key, value as string);
          });

          return new Response(responseBody, {
            headers,
            status: result.status,
            statusText: result.statusText,
          });
        } catch (error: Error) {
          return new Response(
            JSON.stringify({
              message: error.message,
              name: error.name,
              status: error.response?.status || 500,
            }),
            {
              status: error.response?.status || 500,
              statusText: error.message,
            },
          );
        }
      },
    },
  },
);

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

export const getProfile = async (userId: string) => {
  const profile = await supabase.fetchData<'profiles'>(
    {
      column: 'id',
      value: userId,
    },
    'profiles',
  );

  return profile;
};
