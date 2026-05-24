import { Platform } from "react-native";
import { getSupabaseClient } from "../client";

export async function signInWithFacebook(): Promise<boolean> {
  let LoginManager: any;
  let AccessToken: any;
  let AuthenticationToken: any;
  try {
    ({
      LoginManager,
      AccessToken,
      AuthenticationToken,
    } = require("react-native-fbsdk-next"));
  } catch {
    throw new Error(
      "[@nugi1/expo-supabase-auth] react-native-fbsdk-next is required for Facebook sign-in. Install it with: npx expo install react-native-fbsdk-next"
    );
  }

  let Crypto: any;
  try {
    Crypto = require("expo-crypto");
  } catch {
    throw new Error(
      "[@nugi1/expo-supabase-auth] expo-crypto is required for Facebook sign-in. Install it with: npx expo install expo-crypto"
    );
  }

  LoginManager.logOut();

  if (Platform.OS === "ios") {
    return signInWithFacebookLimited(
      LoginManager,
      AuthenticationToken,
      Crypto
    );
  }

  // Android: classic login — use access token
  const result = await LoginManager.logInWithPermissions([
    "public_profile",
    "email",
  ]);

  if (result.isCancelled) return false;

  const tokenData = await AccessToken.getCurrentAccessToken();
  if (!tokenData?.accessToken) {
    throw new Error("No access token received from Facebook");
  }

  const { error } = await getSupabaseClient().auth.signInWithIdToken({
    provider: "facebook",
    token: tokenData.accessToken,
  });

  if (error) throw error;
  return true;
}

// iOS Limited Login: returns an OIDC JWT instead of a Graph API access token.
async function signInWithFacebookLimited(
  LoginManager: any,
  AuthenticationToken: any,
  Crypto: any
): Promise<boolean> {
  const rawNonce = Array.from(
    Crypto.getRandomBytes(16) as Uint8Array,
    (b: number) => b.toString(16).padStart(2, "0")
  ).join("");
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  const result = await LoginManager.logInWithPermissions(
    ["public_profile", "email"],
    "limited",
    hashedNonce
  );

  if (result.isCancelled) return false;

  const authToken = await AuthenticationToken.getAuthenticationTokenIOS();
  if (!authToken?.authenticationToken) {
    throw new Error("No authentication token received from Facebook");
  }

  const { error } = await getSupabaseClient().auth.signInWithIdToken({
    provider: "facebook",
    token: authToken.authenticationToken,
    nonce: rawNonce,
  });

  if (error) throw error;
  return true;
}
