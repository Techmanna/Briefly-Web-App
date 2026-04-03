import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type Subscription = {
  id: string;
  user_id: string;
  category_id: string;
  created_at: string;
};

export type User = {
  id: string;
  email: string | null;
  name: string | null;
  provider: string;
  provider_id: string | null;
  phone: string | null;
  is_phone_verified: boolean;
  language_preference: "en" | "pidgin" | "yoruba" | "hausa" | "igbo";
  email_enabled: boolean;
  push_enabled: boolean;
  whatsapp_enabled: boolean;
  telegram_enabled: boolean;
  whatsapp_number: string | null;
  telegram_chat_id: string | null;
  push_token: string | null;
  awareness_score: number;
  created_at: string;
  updated_at: string;
  subscriptions?: Subscription[];
  count: {
    subscriptions: number;
    digests: number;
  };
};

export type UpdatePreferencesInput = {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  whatsappEnabled?: boolean;
  telegramEnabled?: boolean;
  whatsappNumber?: string;
  telegramChatId?: string;
  pushToken?: string;
  name?: string;
  email?: string;
  categoryIds?: string[];
  languagePreference?: "en" | "pidgin" | "yoruba" | "hausa" | "igbo";
};

export function getUser(id: string) {
  return apiFetch<User>(endpoints.users.byId(id), {
    method: "GET",
    auth: true,
  });
}

export function updatePreferences(id: string, input: UpdatePreferencesInput) {
  return apiFetch<User>(endpoints.users.preferences(id), {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export function requestPhoneVerification(
  id: string,
  input: { phoneNumber: string },
) {
  return apiFetch<{ message: string }>(
    endpoints.users.verifyPhone.request(id),
    {
      method: "POST",
      body: input,
      auth: true,
    },
  );
}

export function confirmPhoneVerification(id: string, input: { code: string }) {
  return apiFetch<User>(endpoints.users.verifyPhone.confirm(id), {
    method: "POST",
    body: input,
    auth: true,
  });
}
