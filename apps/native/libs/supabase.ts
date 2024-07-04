import { Supabase } from '@cococom/supabase/libs';
import Constants from 'expo-constants';

const { url, anonKey } = Constants.expoConfig?.extra?.supabase || {};

export const supabase = new Supabase(url, anonKey);
