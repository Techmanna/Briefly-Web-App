import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersClient from "@/api/clients/users";

export function useUserFeedbackPreferencesQuery(userId: string) {
  return useQuery({
    queryKey: ["user", userId, "feedback-preferences"],
    queryFn: () => usersClient.getFeedbackPreferences(userId),
    enabled: Boolean(userId),
  });
}

export function useUnmuteCategoryMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => usersClient.unmuteCategory(userId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", userId, "feedback-preferences"],
      });
    },
  });
}

export function useUnmuteSourceMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sourceId: string) => usersClient.unmuteSource(userId, sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", userId, "feedback-preferences"],
      });
    },
  });
}

