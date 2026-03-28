"use client";

import { useParams, useRouter } from "next/navigation";
import { ExternalLink, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { digestClient, usersClient } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/use-auth";
import { useMemo, useState } from "react";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id ?? "";
  const id = params.id as string;

  const dateParam =
    id === "latest" || id === "1"
      ? ""
      : /^\d{4}-\d{2}-\d{2}$/.test(id)
        ? id
        : "";

  const mode = "latest";

  const query = useQuery({
    queryKey: ["digest", mode, dateParam || "latest"],
    queryFn: () =>
      mode === "latest"
        ? digestClient.getLatestDigest()
        : digestClient.getDigestByDate(dateParam),
    enabled: mode === "latest" || Boolean(dateParam),
  });

  const userQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersClient.getUser(userId),
    enabled: Boolean(userId),
  });

  const [isWhatsappAlertClosed, setIsWhatsappAlertClosed] = useState(false);

  const shouldShowWhatsappAlert = useMemo(() => {
    const user = userQuery.data;
    if (!session?.accessToken) return false;
    if (!user) return false;
    if (isWhatsappAlertClosed) return false;

    const storageKey = `briefly_whatsapp_setup_dismissed_${user.id}`;
    const dismissed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(storageKey) === "1";
    if (dismissed) return false;

    return !user.phone || !user.is_phone_verified;
  }, [isWhatsappAlertClosed, session?.accessToken, userQuery.data]);

  const digest = query.data;
  const formattedDate = digest?.date
    ? new Date(digest.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-6">
      {shouldShowWhatsappAlert ? (
        <div className="glass-panel rounded-2xl p-5 shadow-sm border-border/60 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {/* <MessageCircle className="h-5 w-5 text-primary" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="w-6 h-6 lg:w-7 lg:h-7"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Get your brief on WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">
                  Set up and verify your WhatsApp number so you can receive your
                  daily brief quickly.
                </p>
                <div className="pt-2">
                  <Button
                    className="rounded-full px-6"
                    onClick={() => router.push("/settings?section=whatsapp")}
                  >
                    Continue with WhatsApp
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => {
                const user = userQuery.data;
                if (user && typeof window !== "undefined") {
                  window.localStorage.setItem(
                    `briefly_whatsapp_setup_dismissed_${user.id}`,
                    "1",
                  );
                }
                setIsWhatsappAlertClosed(true);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        {query.isPending ? (
          <>
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-5 w-44" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-heading font-bold">
              Brief for {formattedDate || id}
            </h1>
            <p className="text-muted-foreground">Know what matters today.</p>
          </>
        )}
      </div>

      <div className="space-y-4">
        {/* {mode === "byDate" && !dateParam ? (
          <div className="glass-panel rounded-2xl p-6 shadow-sm border-border/60">
            <p className="text-sm text-muted-foreground">
              Invalid brief date. Use YYYY-MM-DD (example: 2026-03-11).
            </p>
          </div>
        ) : null} */}

        {query.isPending
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl p-6 shadow-sm border-border/60"
              >
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-5/6 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-4" />
                <Skeleton className="h-8 w-36 rounded-full" />
              </div>
            ))
          : null}

        {query.isError ? (
          <div className="glass-panel rounded-2xl p-6 shadow-sm border-border/60">
            <p className="text-sm text-destructive font-medium">
              {(query.error as Error).message || "Failed to load brief."}
            </p>
            <div className="pt-4">
              <Button
                onClick={() => query.refetch()}
                className="rounded-full px-6"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {!query.isPending && !query.isError && digest
          ? digest.items.map((item, index) => {
              const category = item.news?.category?.name ?? "General";
              const source = item.news?.source?.name ?? "Source";
              const title = item.news?.title ?? "Untitled";
              const summary = item.news?.summary ?? "";
              const url = item.news?.url?.trim() || undefined;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-border/60",
                    "animate-slide-up",
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">
                      {category}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {source}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold leading-tight mb-3 text-primary">
                    {item.rank}. {title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-4">
                    {summary || "Open to read the full story."}
                  </p>
                  {url ? (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                      >
                        <a href={url} target="_blank" rel="noreferrer">
                          Read Full Story{" "}
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import {
//   ExternalLink,
//   ChevronDown,
//   ChevronUp,
//   Share2,
//   Bookmark,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// const BRIEF_ITEMS = [
//   {
//     id: 1,
//     category: "Economy",
//     title: "Naira trades at ₦1,585/$ amid continued pressure",
//     summary:
//       "The Nigerian Naira continues to face pressure in the foreign exchange market, trading at ₦1,585 to the dollar. Analysts predict further fluctuations as the central bank implements new policies to stabilize the currency.",
//     source: "BBC",
//     url: "#",
//     readTime: "2 min",
//   },
//   {
//     id: 2,
//     category: "Tech",
//     title: "Google launches new AI developer tools",
//     summary:
//       "Google has announced a suite of new AI tools aimed at helping developers build more efficient applications. The tools include enhanced code completion, debugging features, and seamless integration with existing cloud infrastructure.",
//     source: "TechCrunch",
//     url: "#",
//     readTime: "3 min",
//   },
//   {
//     id: 3,
//     category: "Opportunity",
//     title: "Entrepreneurship grant applications open",
//     summary:
//       "The National Entrepreneurship Grant has opened applications for the 2024 cohort. Small business owners can apply for funding up to $5,000 to scale their operations. Priority is given to technology and agriculture sectors.",
//     source: "Business Insider",
//     url: "#",
//     readTime: "1 min",
//   },
//   {
//     id: 4,
//     category: "Global News",
//     title: "Global markets rally on inflation data",
//     summary:
//       "Stock markets across Asia and Europe rallied today following the release of positive inflation data from the US, suggesting that interest rate hikes may be pausing. The S&P 500 reached a new high.",
//     source: "Reuters",
//     url: "#",
//     readTime: "4 min",
//   },
//   {
//     id: 5,
//     category: "Startups",
//     title: "Nigerian startups raise $25M in Q1",
//     summary:
//       "Despite a global funding slowdown, Nigerian startups have managed to raise over $25 million in the first quarter of the year, driven by fintech and logistics sectors. This marks a 15% increase year-over-year.",
//     source: "TechCabal",
//     url: "#",
//     readTime: "2 min",
//   },
// ];

// export default function DashboardPage() {
//   const [expanded, setExpanded] = useState<number | null>(null);

//   const toggleExpand = (id: number) => {
//     setExpanded(expanded === id ? null : id);
//   };

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <div className="space-y-1">
//         <h1 className="text-3xl font-heading font-bold tracking-tight">
//           Your Briefing
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           5 things you need to know today.
//         </p>
//       </div>

//       <div className="grid gap-4">
//         {BRIEF_ITEMS.map((item, index) => (
//           <div
//             key={item.id}
//             className={cn(
//               "group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300",
//               expanded === item.id
//                 ? "shadow-md ring-1 ring-primary/5"
//                 : "hover:shadow-sm hover:border-border",
//             )}
//             style={{ animationDelay: `${index * 0.1}s` }}
//           >
//             <div
//               className="p-5 sm:p-6 cursor-pointer"
//               onClick={() => toggleExpand(item.id)}
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <span
//                     className={cn(
//                       "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md",
//                       "bg-secondary text-primary",
//                     )}
//                   >
//                     {item.category}
//                   </span>
//                   <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
//                     {item.source} • {item.readTime}
//                   </span>
//                 </div>
//                 <div className="text-muted-foreground/50 group-hover:text-primary transition-colors">
//                   {expanded === item.id ? (
//                     <ChevronUp className="h-5 w-5" />
//                   ) : (
//                     <ChevronDown className="h-5 w-5" />
//                   )}
//                 </div>
//               </div>

//               <h3
//                 className={cn(
//                   "font-heading font-semibold leading-tight transition-all duration-300",
//                   expanded === item.id
//                     ? "text-xl sm:text-2xl mb-4"
//                     : "text-lg sm:text-xl group-hover:text-primary/80",
//                 )}
//               >
//                 {item.title}
//               </h3>

//               <div
//                 className={cn(
//                   "grid transition-all duration-300 ease-in-out",
//                   expanded === item.id
//                     ? "grid-rows-[1fr] opacity-100"
//                     : "grid-rows-[0fr] opacity-0",
//                 )}
//               >
//                 <div className="overflow-hidden">
//                   <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6 border-l-2 border-primary/20 pl-4">
//                     {item.summary}
//                   </p>

//                   <div className="flex items-center justify-between pt-2 border-t border-border/50">
//                     {/* <div className="flex gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-9 w-9 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary"
//                       >
//                         <Bookmark className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-9 w-9 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary"
//                       >
//                         <Share2 className="h-4 w-4" />
//                       </Button>
//                     </div> */}
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       asChild
//                       className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors"
//                     >
//                       <a
//                         href={item.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         Read Full Story{" "}
//                         <ExternalLink className="ml-2 h-3 w-3" />
//                       </a>
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* <div className="glass-panel rounded-2xl p-6 shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="font-heading font-semibold text-lg">Daily Progress</h3>
//           <span className="text-2xl font-bold text-primary">
//             72
//             <span className="text-sm text-muted-foreground font-normal">
//               /100
//             </span>
//           </span>
//         </div>
//         <div className="w-full bg-secondary rounded-full h-2 mb-4 overflow-hidden">
//           <div className="bg-primary h-2 rounded-full w-[72%]" />
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-background border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
//             Economy <span className="text-green-600">✔</span>
//           </div>
//           <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-background border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
//             Tech <span className="text-green-600">✔</span>
//           </div>
//           <div className="flex items-center gap-1.5 text-xs font-medium text-primary bg-background border border-border/50 px-3 py-1.5 rounded-full shadow-sm">
//             Opportunities <span className="text-green-600">✔</span>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// }
