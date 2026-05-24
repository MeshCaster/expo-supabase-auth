import type { OAuthProvider } from "./types";
import { signInWithGoogle } from "./providers/google";
import { signInWithFacebook } from "./providers/facebook";
import { signInWithApple } from "./providers/apple";

export { signInWithGoogle, signInWithFacebook, signInWithApple };

export async function signInWithSocial(
  provider: OAuthProvider
): Promise<boolean> {
  switch (provider) {
    case "google":
      return signInWithGoogle();
    case "facebook":
      return signInWithFacebook();
    case "apple":
      return signInWithApple();
  }
}
