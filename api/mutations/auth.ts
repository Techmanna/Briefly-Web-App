import { useMutation } from "@tanstack/react-query";
import * as authClient from "@/api/clients/auth";
import { useAuth } from "@/lib/auth/use-auth";

function toSession(res: authClient.AuthResponse) {
  return { accessToken: res.access_token, user: res.user };
}

export function useLoginMutation() {
  const auth = useAuth();
  return useMutation({
    mutationFn: authClient.login,
    onSuccess: (res) => auth.setSession(toSession(res)),
  });
}

export function useRegisterMutation() {
  const auth = useAuth();
  return useMutation({
    mutationFn: authClient.register,
    onSuccess: (res) => auth.setSession(toSession(res)),
  });
}

export function useGoogleLoginMutation() {
  const auth = useAuth();
  return useMutation({
    mutationFn: authClient.googleLogin,
    onSuccess: (res) => auth.setSession(toSession(res)),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: authClient.forgotPassword });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: authClient.resetPassword });
}

export function useVerifyEmailMutation() {
  return useMutation({ mutationFn: authClient.verifyEmail });
}

export function useWhatsappRequestOtpMutation() {
  return useMutation({ mutationFn: authClient.whatsappRequestOtp });
}

export function useWhatsappVerifyOtpMutation() {
  const auth = useAuth();
  return useMutation({
    mutationFn: authClient.whatsappVerifyOtp,
    onSuccess: (res) => auth.setSession(toSession(res)),
  });
}

export function useTelegramRegisterMutation() {
  const auth = useAuth();
  return useMutation({
    mutationFn: authClient.telegramRegister,
    onSuccess: (res) => auth.setSession(toSession(res)),
  });
}

export function useSetPasswordMutation() {
  return useMutation({ mutationFn: authClient.setPassword });
}
