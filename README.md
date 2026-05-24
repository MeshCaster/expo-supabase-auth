# @nugi1/expo-supabase-auth

Config-driven Supabase authentication with native social login (Google, Facebook, Apple) for Expo apps.

## Features

- Config-driven setup — call `initAuth()` once, use hooks everywhere
- Native Google Sign-In via `@react-native-google-signin/google-signin`
- Native Facebook Login via `react-native-fbsdk-next` (iOS Limited Login + Android classic)
- Native Apple Sign-In via `expo-apple-authentication`
- MMKV persistent storage with in-memory fallback (Expo Go)
- Deep link handling for email verification callbacks
- Lazy Supabase client — no crashes if `initAuth()` hasn't been called

## Install

```bash
npm install @nugi1/expo-supabase-auth
```

### Peer dependencies

Install only the providers you need:

```bash
# Google
npx expo install @react-native-google-signin/google-signin

# Facebook
npx expo install react-native-fbsdk-next expo-crypto

# Apple
npx expo install expo-apple-authentication expo-crypto

# Persistent storage (recommended)
npx expo install react-native-mmkv

# Deep link support
npx expo install expo-linking
```

## Quick Start

### 1. Initialize auth (app entry)

```typescript
import { initAuth } from '@nugi1/expo-supabase-auth';

initAuth({
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  google: {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  },
  facebook: { enabled: true },
  apple: { enabled: true },
});
```

### 2. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from '@nugi1/expo-supabase-auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* your app */}
    </AuthProvider>
  );
}
```

### 3. Use auth in components

```tsx
import { useAuth, signInWithSocial } from '@nugi1/expo-supabase-auth';

function LoginScreen() {
  const { session, user, loading, signOut } = useAuth();

  if (loading) return <ActivityIndicator />;
  if (session) return <Text>Welcome, {user?.email}</Text>;

  return (
    <>
      <Button title="Sign in with Google" onPress={() => signInWithSocial('google')} />
      <Button title="Sign in with Facebook" onPress={() => signInWithSocial('facebook')} />
      <Button title="Sign in with Apple" onPress={() => signInWithSocial('apple')} />
    </>
  );
}
```

### 4. Access Supabase client directly

```typescript
import { getSupabaseClient } from '@nugi1/expo-supabase-auth';

const supabase = getSupabaseClient();
const { data } = await supabase.from('profiles').select('*');
```

## API

### `initAuth(config: AuthConfig)`

Initialize the auth module. Must be called before any other auth functions.

### `getSupabaseClient(): SupabaseClient`

Returns the lazy-initialized Supabase client.

### `<AuthProvider>`

React context provider. Includes deep link handling for auth callbacks. Wrap your app's root component.

### `useAuth()`

Hook that returns `{ session, user, loading, signOut }`. Works anywhere — does not require `AuthProvider`.

### `useAuthContext()`

Same as `useAuth()` but reads from `AuthProvider` context. Requires being inside `<AuthProvider>`.

### `signInWithSocial(provider: 'google' | 'facebook' | 'apple')`

Dispatches to the appropriate native sign-in flow. Returns `true` on success, `false` if cancelled.

### `signInWithGoogle()` / `signInWithFacebook()` / `signInWithApple()`

Individual sign-in functions if you prefer direct calls.

## Types

```typescript
interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  google?: { webClientId?: string; iosClientId?: string };
  facebook?: { enabled: boolean };
  apple?: { enabled: boolean };
}

type OAuthProvider = 'google' | 'facebook' | 'apple';
```

## License

MIT
