import { Supabase } from "@cococom/supabase/libs";

import { loadEnv } from "./util.js";


loadEnv();

// eslint-disable-next-line turbo/no-undeclared-env-vars
const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;


export const supabase = new Supabase(SUPABASE_URL!, SUPABASE_ANON_KEY!);