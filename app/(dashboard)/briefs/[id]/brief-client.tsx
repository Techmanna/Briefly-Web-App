// "use client";

// import { useParams } from "next/navigation";
// import { ExternalLink, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useQuery } from "@tanstack/react-query";
// import { digestClient } from "@/api";
// import { Skeleton } from "@/components/ui/skeleton";
// import { cn } from "@/lib/utils";

// export function BriefClient() {
//   const params = useParams();
//   const id = params.id as string;

//   const dateParam =
//     id === "latest" || id === "1"
//       ? ""
//       : /^\d{4}-\d{2}-\d{2}$/.test(id)
//         ? id
//         : "";

//   const mode = id === "latest" || id === "1" ? "latest" : "byDate";

//   const query = useQuery({
//     queryKey: ["digest", mode, dateParam || "latest"],
//     queryFn: () =>
//       mode === "latest"
//         ? digestClient.getLatestDigest()
//         : digestClient.getDigestByDate(dateParam),
//     enabled: mode === "latest" || Boolean(dateParam),
//   });

//   const digest = query.data;
//   const formattedDate = digest?.date
//     ? new Date(digest.date).toLocaleDateString("en-US", {
//         weekday: "long",
//         month: "long",
//         day: "numeric",
//         year: "numeric",
//       })
//     : "";

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-2">
//         <Button variant="ghost" size="sm" asChild className="-ml-2">
//           <Link href="/briefs">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back
//           </Link>
//         </Button>
//       </div>

//       <div className="space-y-2">
//         {query.isPending ? (
//           <>
//             <Skeleton className="h-9 w-72" />
//             <Skeleton className="h-5 w-44" />
//           </>
//         ) : (
//           <>
//             <h1 className="text-3xl font-heading font-bold">
//               Brief for {formattedDate || id}
//             </h1>
//             <p className="text-muted-foreground">Daily digest</p>
//           </>
//         )}
//       </div>

//       <div className="space-y-4">
//         {mode === "byDate" && !dateParam ? (
//           <div className="glass-panel rounded-2xl p-6 shadow-sm border-border/60">
//             <p className="text-sm text-muted-foreground">
//               Invalid brief date. Use YYYY-MM-DD (example: 2026-03-11).
//             </p>
//           </div>
//         ) : null}

//         {query.isPending
//           ? Array.from({ length: 5 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="glass-panel rounded-2xl p-6 shadow-sm border-border/60"
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <Skeleton className="h-5 w-24 rounded-md" />
//                   <Skeleton className="h-4 w-16" />
//                 </div>
//                 <Skeleton className="h-6 w-5/6 mb-3" />
//                 <Skeleton className="h-4 w-full mb-2" />
//                 <Skeleton className="h-4 w-4/5 mb-4" />
//                 <Skeleton className="h-8 w-36 rounded-full" />
//               </div>
//             ))
//           : null}

//         {query.isError ? (
//           <div className="glass-panel rounded-2xl p-6 shadow-sm border-border/60">
//             <p className="text-sm text-destructive font-medium">
//               {(query.error as Error).message || "Failed to load brief."}
//             </p>
//             <div className="pt-4">
//               <Button
//                 onClick={() => query.refetch()}
//                 className="rounded-full px-6"
//               >
//                 Retry
//               </Button>
//             </div>
//           </div>
//         ) : null}

//         {!query.isPending && !query.isError && digest
//           ? digest.items.map((item, index) => {
//               const category = item.news?.category?.name ?? "General";
//               const source = item.news?.source?.name ?? "Source";
//               const title = item.news?.title ?? "Untitled";
//               const summary = item.news?.summary ?? "";
//               const url = item.news?.url?.trim() || undefined;

//               return (
//                 <div
//                   key={item.id}
//                   className={cn(
//                     "glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-border/60",
//                     "animate-slide-up",
//                   )}
//                   style={{ animationDelay: `${index * 0.05}s` }}
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">
//                       {category}
//                     </span>
//                     <span className="text-xs text-muted-foreground font-medium">
//                       {source}
//                     </span>
//                   </div>
//                   <h3 className="text-xl font-heading font-semibold leading-tight mb-3 text-primary">
//                     {item.rank}. {title}
//                   </h3>
//                   <p className="text-muted-foreground text-base leading-relaxed mb-4">
//                     {summary || "Open to read the full story."}
//                   </p>
//                   {url ? (
//                     <div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         asChild
//                         className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
//                       >
//                         <a href={url} target="_blank" rel="noreferrer">
//                           Read Full Story{" "}
//                           <ExternalLink className="ml-2 h-3 w-3" />
//                         </a>
//                       </Button>
//                     </div>
//                   ) : null}
//                 </div>
//               );
//             })
//           : null}
//       </div>
//     </div>
//   );
// }
