"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, ThumbsDown, ThumbsUp, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNewsFeedbackMutation } from "@/api";

type Props = {
  category: string;
  source: string;
  title: string;
  summary: string;
  url?: string;
  newsId?: string;
  rank?: number;
  variant?: "card" | "glass";
  className?: string;
  style?: CSSProperties;
};

export function DigestNewsItem({
  category,
  source,
  title,
  summary,
  url,
  newsId,
  rank,
  variant = "card",
  className,
  style,
}: Props) {
  const feedbackMutation = useNewsFeedbackMutation();
  const [hidden, setHidden] = useState(false);
  const [pendingTimer, setPendingTimer] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  async function sendFeedback(type: "MORE" | "LESS") {
    if (!newsId) return;
    try {
      await feedbackMutation.mutateAsync({ newsId, type });
      toast.success("Got it", {
        description:
          type === "MORE"
            ? "We’ll show more stories like this."
            : "We’ll show fewer stories like this.",
      });
    } catch (e) {
      toast.error("Failed", { description: (e as Error).message });
    }
  }

  function scheduleNotInterested() {
    if (!newsId) return;
    if (pendingTimer) return;

    setHidden(true);

    const timer = window.setTimeout(async () => {
      try {
        await feedbackMutation.mutateAsync({
          newsId,
          type: "NOT_INTERESTED",
        });
      } catch (e) {
        setHidden(false);
        toast.error("Failed", { description: (e as Error).message });
      } finally {
        setPendingTimer(null);
        timerRef.current = null;
      }
    }, 8000);

    timerRef.current = timer;
    setPendingTimer(timer);

    toast.success("Hidden", {
      description: "We’ll avoid similar stories.",
      duration: 8000,
      action: {
        label: "Undo",
        onClick: () => {
          window.clearTimeout(timer);
          timerRef.current = null;
          setPendingTimer(null);
          setHidden(false);
        },
      },
    });
  }

  if (hidden) return null;

  const header = (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">
        {category}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">
          {source}
        </span>
      </div>
    </div>
  );

  const titleNode = (
    <div className="font-heading text-lg leading-tight font-semibold">
      {typeof rank === "number" ? `${rank}. ` : ""}
      {title}
    </div>
  );

  const descriptionNode = (
    <div className="text-base text-foreground/70">
      {summary || "Open to read the full story."}
    </div>
  );

  const actions = newsId ? (
    <div className="flex items-center gap-3">
      <button type="button" onClick={scheduleNotInterested}>
        <Ban className="h-4 w-4 text-destructive hover:text-destructive/50 transition-colors" />
      </button>
      <button type="button" onClick={() => sendFeedback("LESS")}>
        <ThumbsDown className="h-4 w-4 hover:text-primary/50 transition-colors" />
      </button>
      <button type="button" onClick={() => sendFeedback("MORE")}>
        <ThumbsUp className="h-4 w-4 hover:text-primary/50 transition-colors" />
      </button>
    </div>
  ) : null;

  const readButton = url ? (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="rounded-full px-4 text-xs h-8 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
    >
      <a href={url} target="_blank" rel="noreferrer">
        Read Full Story <ExternalLink className="ml-2 h-3 w-3" />
      </a>
    </Button>
  ) : null;

  const footer = (
    <div className="flex justify-between items-center">
      {readButton ? <div className="pt-2">{readButton}</div> : <div />}
      {actions}
    </div>
  );

  if (variant === "glass") {
    return (
      <div
        className={cn(
          "glass-panel rounded-2xl p-6 shadow-sm border-border/60",
          className,
        )}
        style={style}
      >
        <div className="space-y-3">
          {header}
          <div className="text-xl font-heading font-semibold leading-tight text-primary">
            {typeof rank === "number" ? `${rank}. ` : ""}
            {title}
          </div>
          <div className="text-muted-foreground text-base leading-relaxed">
            {summary || "Open to read the full story."}
          </div>
          {url || actions ? (
            <div className="flex items-center justify-between">
              {url ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                >
                  <a href={url} target="_blank" rel="noreferrer">
                    Read Full Story <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              ) : (
                <div />
              )}
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "border-border/50 shadow-none rounded-2xl overflow-hidden hover:border-primary/20 transition-colors",
        className,
      )}
      style={style}
    >
      <CardHeader className="space-y-2">
        {header}
        <CardTitle className="font-heading text-lg leading-tight">
          {titleNode}
        </CardTitle>
        <CardDescription className="text-base text-foreground/70">
          {descriptionNode}
        </CardDescription>
        {footer}
      </CardHeader>
    </Card>
  );
}
