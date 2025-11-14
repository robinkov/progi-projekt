
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sioqgofegshqcrmwbqtd.supabase.co";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("EXPO_PUBLIC_SUPABASE_KEY is missing from environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
