import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";

const supabaseUrl = "https://sioqgofegshqcrmwbqtd.supabase.co";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("EXPO_PUBLIC_SUPABASE_KEY is missing from environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage, // Or custom storage (see below)
    autoRefreshToken: true, // Auto-refresh when app is foregrounded
    persistSession: true, // Save/restore session automatically
    detectSessionInUrl: false, // Not needed in native apps
    lock: processLock,
  },
});

export default supabase;
