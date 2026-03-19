import { useQuery, useMutation } from "@tanstack/react-query";
import * as adminClient from "@/api/clients/admin";

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminClient.getSystemStats(),
  });
}

export function useIngestionLogsQuery(limit = 50) {
  return useQuery({
    queryKey: ["admin", "logs", "ingestion", limit],
    queryFn: () => adminClient.getIngestionLogs(limit),
  });
}

export function useDigestLogsQuery(limit = 50) {
  return useQuery({
    queryKey: ["admin", "logs", "digest", limit],
    queryFn: () => adminClient.getDigestLogs(limit),
  });
}

export function useAdminUsersQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: () => adminClient.getAdminUsers(page, limit),
  });
}

export function useAdminLoginMutation() {
  return useMutation({
    mutationFn: (input: Parameters<typeof adminClient.adminLogin>[0]) =>
      adminClient.adminLogin(input),
  });
}

export function useUpdateAdminProfileMutation() {
  return useMutation({
    mutationFn: (input: Parameters<typeof adminClient.updateAdminProfile>[0]) =>
      adminClient.updateAdminProfile(input),
  });
}
