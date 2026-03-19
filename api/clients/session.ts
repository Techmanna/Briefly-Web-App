const TOKEN_KEY = "briefly_token";
const USER_KEY = "briefly_user";

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  provider: string;
  provider_id: string | null;
  is_phone_verified?: boolean;
  email_enabled?: boolean;
  push_enabled?: boolean;
  whatsapp_enabled?: boolean;
  telegram_enabled?: boolean;
  whatsapp_number?: string | null;
  telegram_chat_id?: string | null;
  push_token?: string | null;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem(TOKEN_KEY);
  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    const user = JSON.parse(rawUser) as AuthUser;
    return { accessToken: token, user };
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken ?? null;
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}
