import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersClient from "@/api/clients/users";

export function useUpdatePreferencesMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: usersClient.UpdatePreferencesInput) =>
      usersClient.updatePreferences(userId, input),
    onSuccess: (user) => {
      queryClient.setQueryData(["user", userId], user);
    },
  });
}

export function useRequestPhoneVerificationMutation(userId: string) {
  return useMutation({
    mutationFn: (input: { phoneNumber: string }) =>
      usersClient.requestPhoneVerification(userId, input),
  });
}

export function useConfirmPhoneVerificationMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { code: string }) =>
      usersClient.confirmPhoneVerification(userId, input),
    onSuccess: (user) => {
      queryClient.setQueryData(["user", userId], user);
    },
  });
}

