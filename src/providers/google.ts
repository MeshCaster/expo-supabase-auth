import { getSupabaseClient } from "../client";
import { getConfig } from "../config";

let configured = false;

export async function signInWithGoogle(): Promise<boolean> {
  let GoogleSignin: any;
  try {
    ({ GoogleSignin } = require("@react-native-google-signin/google-signin"));
  } catch {
    throw new Error(
      "[@nugi1/expo-supabase-auth] @react-native-google-signin/google-signin is required for Google sign-in. Install it with: npx expo install @react-native-google-signin/google-signin"
    );
  }

  if (!configured) {
    const config = getConfig();
    GoogleSignin.configure({
      webClientId: config.google?.webClientId,
      iosClientId: config.google?.iosClientId,
    });
    configured = true;
  }

  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (response.type === "cancelled") {
    return false;
  }

  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error("No ID token received from Google");
  }

  const { error } = await getSupabaseClient().auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });

  if (error) throw error;
  return true;
}
