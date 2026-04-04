import { endpoints } from "../endpoints";
import { apiFetch } from "./http";

export type NewsFeedbackType = "MORE" | "LESS" | "NOT_INTERESTED";

export type PublicNewsItem = {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary?: string | null;
  url: string;
  published_at: string;
  signal_score: number;
  category: { id: string; name: string; slug: string };
  source: { id: string; name: string; url: string };
};

export function listPublicNews(input?: {
  minSignal?: number;
  take?: number;
  skip?: number;
}) {
  const minSignal = input?.minSignal ?? 0;
  const take = input?.take ?? 50;
  const skip = input?.skip ?? 0;

  const qs = new URLSearchParams();
  qs.set("minSignal", String(minSignal));
  qs.set("take", String(take));
  qs.set("skip", String(skip));

  return apiFetch<PublicNewsItem[]>(`${endpoints.news.list}?${qs.toString()}`, {
    method: "GET",
    auth: false,
  });
}

export function sendNewsFeedback(newsId: string, type: NewsFeedbackType) {
  return apiFetch<{ message: string; type: NewsFeedbackType }>(
    endpoints.news.feedback(newsId),
    {
      method: "POST",
      auth: true,
      body: { type },
    },
  );
}
