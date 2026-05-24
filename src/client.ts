import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getConfig } from "./config";
import { createStorageAdapter } from "./storage";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const config = getConfig();
    _client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        storage: createStorageAdapter(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return _client;
}
