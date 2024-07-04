
import { Supabase } from "@cococom/supabase/libs";

import { loadEnv } from "./util.js";


loadEnv();


export const supabase = new Supabase(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);