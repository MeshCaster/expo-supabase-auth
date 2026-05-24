import React, { createContext, useContext, useEffect } from "react";
import { getSupabaseClient } from "./client";
import { useAuth, UseAuthReturn } from "./useAuth";

const AuthContext = createContext<UseAuthReturn | null>(null);

function extractHashParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return params;
  for (const pair of url.substring(hashIndex + 1).split("&")) {
    const [key, value] = pair.split("=");
    if (key && value)
      params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return params;
}

function handleUrl(url: string) {
  const params = extractHashParams(url);
  if (params.access_token && params.refresh_token) {
    getSupabaseClient().auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
  }
}

function useDeepLinkAuth() {
  useEffect(() => {
    let Linking: any;
    try {
      Linking = require("expo-linking");
    } catch {
      // expo-linking not installed — deep link handling disabled
      return;
    }

    // Handle URL that opened the app (cold start)
    Linking.getInitialURL().then((url: string | null) => {
      if (url) handleUrl(url);
    });

    // Handle URL while app is already open (warm start)
    const sub = Linking.addEventListener("url", ({ url }: { url: string }) =>
      handleUrl(url)
    );
    return () => sub.remove();
  }, []);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  useDeepLinkAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): UseAuthReturn {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "[@nugi1/expo-supabase-auth] useAuthContext must be used within an <AuthProvider>."
    );
  }
  return ctx;
}
