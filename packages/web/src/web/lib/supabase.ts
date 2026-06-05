import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const normalizedSupabaseUrl = supabaseUrl?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

if (!hasSupabaseConfig) {
  console.warn("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.");
}

export const supabase = createClient(
  hasSupabaseConfig ? normalizedSupabaseUrl : "https://placeholder.supabase.co",
  hasSupabaseConfig ? supabaseAnonKey : "placeholder-anon-key"
);
export const isSupabaseConfigured = hasSupabaseConfig;
