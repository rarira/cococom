import { Supabase } from '@cococom/supabase/libs';

export const supabase = new Supabase(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
);
