import type { AuthConfig } from "./types";

let _config: AuthConfig | null = null;

export function initAuth(config: AuthConfig): void {
  _config = config;
}

export function getConfig(): AuthConfig {
  if (!_config) {
    throw new Error(
      "[@nugi1/expo-supabase-auth] initAuth() must be called before using auth features."
    );
  }
  return _config;
}
