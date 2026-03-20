import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as adminClient from "@/api/clients/admin";
import { User } from "@/api/clients/users";
import { useAuth } from "@/lib/auth/use-auth";
import { toSession } from "../mutations/auth";
import * as authClient from "@/api/clients/auth";

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminClient.getSystemStats(),
  });
}

export function useIngestionLogsQuery(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["admin", "logs", "ingestion", page, limit],
    queryFn: () => adminClient.getIngestionLogs(limit),
  });
}

export function useDigestLogsQuery(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["admin", "logs", "digest", page, limit],
    queryFn: () => adminClient.getDigestLogs(limit),
  });
}

export function useAdminUsersQuery(page = 1, limit = 20, search?: string) {
  return useQuery({
    queryKey: ["admin", "users", page, limit, search],
    queryFn: () => adminClient.getAdminUsers(page, limit, search),
  });
}

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      adminClient.updateAdminUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminClient.deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminLoginMutation() {
  const auth = useAuth();
  return useMutation({
    mutationFn: (input: Parameters<typeof adminClient.adminLogin>[0]) =>
      adminClient.adminLogin(input),
    onSuccess: (res: authClient.AuthAdminResponse) =>
      auth.setSession(toSession(res)),
  });
}

export function useUpdateAdminProfileMutation() {
  return useMutation({
    mutationFn: (input: Parameters<typeof adminClient.updateAdminProfile>[0]) =>
      adminClient.updateAdminProfile(input),
  });
}
