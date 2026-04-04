import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as newsClient from "@/api/clients/news";

export function useNewsFeedbackMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { newsId: string; type: newsClient.NewsFeedbackType }) =>
      newsClient.sendNewsFeedback(input.newsId, input.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digest"] });
      queryClient.invalidateQueries({ queryKey: ["digest", "list"] });
      queryClient.invalidateQueries({ queryKey: ["digest", "latest"] });
      queryClient.invalidateQueries({ queryKey: ["digest", "byDate"] });
    },
  });
}

