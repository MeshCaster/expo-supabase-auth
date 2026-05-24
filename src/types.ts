export type OAuthProvider = "google" | "facebook" | "apple";

export interface GoogleConfig {
  webClientId?: string;
  iosClientId?: string;
}

export interface FacebookConfig {
  enabled: boolean;
}

export interface AppleConfig {
  enabled: boolean;
}

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  google?: GoogleConfig;
  facebook?: FacebookConfig;
  apple?: AppleConfig;
}
