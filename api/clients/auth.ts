import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

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

export type AuthAdminUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
};

export type AuthResponse = {
  access_token: string;
  user: AuthUser;
};

export type AuthAdminResponse = {
  access_token: string;
  user: AuthAdminUser;
};

export type TelegramRegisterResponse = AuthResponse & {
  telegram: { token: string; linkUrl: string | null; expiresAt: string };
};

export function login(input: { identifier: string; password: string }) {
  return apiFetch<AuthResponse>(endpoints.auth.login, {
    method: "POST",
    body: input,
  });
}

export function register(input: {
  name: string;
  email: string;
  password: string;
  country?: string;
  region?: string;
  topics?: string[];
}) {
  return apiFetch<AuthResponse>(endpoints.auth.register, {
    method: "POST",
    body: input,
  });
}

export function googleLogin(input: { idToken: string }) {
  return apiFetch<AuthResponse>(endpoints.auth.google, {
    method: "POST",
    body: input,
  });
}

export function forgotPassword(input: { email: string }) {
  return apiFetch<{ message: string }>(endpoints.auth.forgotPassword, {
    method: "POST",
    body: input,
  });
}

export function resetPassword(input: { token: string; password: string }) {
  return apiFetch<{ message: string }>(endpoints.auth.resetPassword, {
    method: "POST",
    body: input,
  });
}

export function verifyEmail(token: string) {
  const query = new URLSearchParams({ token }).toString();
  return apiFetch<{ message: string }>(
    `${endpoints.auth.verifyEmail}?${query}`,
    {
      method: "GET",
    },
  );
}

export function whatsappRequestOtp(input: { phone: string }) {
  return apiFetch<{ message: string }>(endpoints.auth.whatsapp.requestOtp, {
    method: "POST",
    body: input,
  });
}

export function whatsappVerifyOtp(input: { phone: string; code: string }) {
  return apiFetch<AuthResponse>(endpoints.auth.whatsapp.verifyOtp, {
    method: "POST",
    body: input,
  });
}

export function telegramRegister() {
  return apiFetch<TelegramRegisterResponse>(endpoints.auth.telegram.register, {
    method: "POST",
  });
}

export function setPassword(input: { password: string }) {
  return apiFetch<{ message: string }>(endpoints.auth.setPassword, {
    method: "POST",
    body: input,
    auth: true,
  });
}
