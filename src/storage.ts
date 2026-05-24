export function createStorageAdapter() {
  try {
    // MMKV requires native modules — only available in dev builds / production
    const { MMKV } = require("react-native-mmkv");
    const storage = new MMKV({ id: "supabase-auth" });
    return {
      getItem: (key: string): string | null => storage.getString(key) ?? null,
      setItem: (key: string, value: string): void => storage.set(key, value),
      removeItem: (key: string): void => storage.delete(key),
    };
  } catch {
    // Expo Go fallback — in-memory storage (session won't persist across restarts)
    const map = new Map<string, string>();
    return {
      getItem: (key: string): string | null => map.get(key) ?? null,
      setItem: (key: string, value: string): void => {
        map.set(key, value);
      },
      removeItem: (key: string): void => {
        map.delete(key);
      },
    };
  }
}
