import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as sourcesClient from "@/api/clients/sources";

export function useSourcesQuery() {
  return useQuery({
    queryKey: ["admin", "sources"],
    queryFn: () => sourcesClient.getSources(),
  });
}

export function useSourceQuery(id: string) {
  return useQuery({
    queryKey: ["admin", "sources", id],
    queryFn: () => sourcesClient.getSource(id),
    enabled: !!id,
  });
}

export function useCreateSourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: sourcesClient.CreateSourceInput) =>
      sourcesClient.createSource(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
    },
  });
}

export function useUpdateSourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: sourcesClient.UpdateSourceInput }) =>
      sourcesClient.updateSource(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sources", variables.id] });
    },
  });
}

export function useDeleteSourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sourcesClient.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
    },
  });
}

export function useBulkCreateSourcesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: sourcesClient.BulkCreateSourcesInput) =>
      sourcesClient.bulkCreateSources(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sources"] });
    },
  });
}
