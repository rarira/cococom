import { Supabase } from '@cococom/supabase/libs';

export const supabase = new Supabase(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
