import { getSupabaseClient } from "../client";

export async function signInWithApple(): Promise<boolean> {
  let AppleAuthentication: any;
  try {
    AppleAuthentication = require("expo-apple-authentication");
  } catch {
    throw new Error(
      "[@nugi1/expo-supabase-auth] expo-apple-authentication is required for Apple sign-in. Install it with: npx expo install expo-apple-authentication"
    );
  }

  let Crypto: any;
  try {
    Crypto = require("expo-crypto");
  } catch {
    throw new Error(
      "[@nugi1/expo-supabase-auth] expo-crypto is required for Apple sign-in. Install it with: npx expo install expo-crypto"
    );
  }

  const rawNonce = Array.from(
    Crypto.getRandomBytes(16) as Uint8Array,
    (b: number) => b.toString(16).padStart(2, "0")
  ).join("");
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) {
    throw new Error("No identity token received from Apple");
  }

  const { error } = await getSupabaseClient().auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });

  if (error) throw error;
  return true;
}
