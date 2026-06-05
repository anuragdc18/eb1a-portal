import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const normalizedSupabaseUrl = supabaseUrl?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

if (!normalizedSupabaseUrl || !serviceRoleKey) {
  throw new Error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

export const supabaseAdmin = createClient(normalizedSupabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
