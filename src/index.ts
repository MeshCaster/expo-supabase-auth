// Configuration
export { initAuth } from "./config";
export { getSupabaseClient } from "./client";

// Components
export { AuthProvider, useAuthContext } from "./AuthProvider";

// Hooks
export { useAuth } from "./useAuth";
export type { UseAuthReturn } from "./useAuth";

// Social Login
export {
  signInWithSocial,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "./socialLogin";

// Types
export type { AuthConfig, OAuthProvider, GoogleConfig, FacebookConfig, AppleConfig } from "./types";
