export { getApiBaseUrl } from "./config";
export { ApiError } from "./errors";
export { apiFetch } from "./http";

export {
  getSession,
  setSession,
  clearSession,
  getAccessToken,
  type AuthSession,
  type AuthUser as SessionUser,
} from "./session";

export {
  login,
  register,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  whatsappRequestOtp,
  whatsappVerifyOtp,
  telegramRegister,
  setPassword,
  type AuthResponse,
  type AuthUser,
  type TelegramRegisterResponse,
} from "./auth";
