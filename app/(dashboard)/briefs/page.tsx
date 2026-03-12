// "use client";

// import Link from "next/link";
// import { ArrowLeft, ExternalLink } from "lucide-react";
// import { useLatestDigestQuery } from "@/api";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// function formatDate(value: string) {
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   return d.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// export default function BriefsPage() {
//   const query = useLatestDigestQuery();

//   const digest = query.data;
//   const digestDateLabel = digest?.date ? formatDate(digest.date) : "";
//   const digestDateParam = digest?.date ? digest.date.slice(0, 10) : "";

//   if (query.isPending) {
//     return (
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <Skeleton className="h-9 w-56" />
//           <Skeleton className="h-5 w-80" />
//         </div>
//         <div className="grid gap-4">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Card
//               key={i}
//               className="border-border/50 shadow-sm rounded-2xl overflow-hidden"
//             >
//               <CardHeader className="space-y-3">
//                 <Skeleton className="h-5 w-32" />
//                 <Skeleton className="h-6 w-4/5" />
//                 <Skeleton className="h-4 w-3/5" />
//               </CardHeader>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (query.isError || !digest) {
//     return (
//       <div className="space-y-4">
//         <h1 className="text-3xl font-heading font-bold">Briefs</h1>
//         <p className="text-muted-foreground">
//           {(query.error as Error | undefined)?.message ||
//             "Failed to load digest."}
//         </p>
//         <Button onClick={() => query.refetch()} className="rounded-full px-6">
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-2">
//         <Button variant="ghost" size="sm" asChild className="-ml-2">
//           <Link href="/dashboard">
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back
//           </Link>
//         </Button>
//       </div>

//       <div className="space-y-2">
//         <h1 className="text-3xl font-heading font-bold">Daily Brief</h1>
//         <p className="text-muted-foreground">
//           {digestDateLabel ? `Latest: ${digestDateLabel}` : "Latest digest"}
//         </p>
//       </div>

//       {/* <div className="flex items-center gap-3">
//         <Button asChild className="rounded-full px-6">
//           <Link href={`/briefs/${digestDateParam}`}>Open full brief</Link>
//         </Button>
//         <Button asChild variant="outline" className="rounded-full px-6">
//           <Link href="/dashboard">Back to dashboard</Link>
//         </Button>
//       </div> */}

//       <div className="grid gap-4">
//         {digest.items.slice(0, 10).map((item) => {
//           const category = item.news?.category?.name ?? "General";
//           const source = item.news?.source?.name ?? "Source";
//           const title = item.news?.title ?? "Untitled";
//           const summary = item.news?.summary ?? "";
//           const url = item.news?.url?.trim() || undefined;

//           return (
//             <Card
//               key={item.id}
//               className="border-border/50 shadow-sm rounded-2xl overflow-hidden"
//             >
//               <CardHeader className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">
//                     {category}
//                   </span>
//                   <span className="text-xs text-muted-foreground font-medium">
//                     {source}
//                   </span>
//                 </div>
//                 <CardTitle className="font-heading text-lg leading-tight">
//                   {item.rank}. {title}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   {summary || "Open to read the full story."}
//                 </CardDescription>
//                 {url ? (
//                   <div className="pt-2">
//                     <Button
//                       asChild
//                       variant="outline"
//                       size="sm"
//                       className="rounded-full px-4 text-xs"
//                     >
//                       <a href={url} target="_blank" rel="noreferrer">
//                         Read Full Story{" "}
//                         <ExternalLink className="ml-2 h-3 w-3" />
//                       </a>
//                     </Button>
//                   </div>
//                 ) : null}
//               </CardHeader>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLatestDigestQuery } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BriefsPage() {
  const query = useLatestDigestQuery();

  const digest = query.data;
  const digestDateLabel = digest?.date ? formatDate(digest.date) : "";
  const digestDateParam = digest?.date ? digest.date.slice(0, 10) : "";

  if (query.isPending) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card
              key={i}
              className="border-border/50 shadow-sm rounded-2xl overflow-hidden"
            >
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (query.isError || !digest) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-heading font-bold">Briefs</h1>
        <p className="text-muted-foreground">
          {(query.error as Error | undefined)?.message ||
            "Failed to load digest."}
        </p>
        <Button onClick={() => query.refetch()} className="rounded-full px-6">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold">Daily Brief</h1>
        <p className="text-muted-foreground">
          {digestDateLabel ? `Latest: ${digestDateLabel}` : "Latest digest"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild className="rounded-full px-6">
          <Link href={`/briefs/${digestDateParam}`}>Open full brief</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {digest.items.slice(0, 10).map((item) => {
          const category = item.news?.category?.name ?? "General";
          const source = item.news?.source?.name ?? "Source";
          const title = item.news?.title ?? "Untitled";
          const summary = item.news?.summary ?? "";
          const url = item.news?.url?.trim() || undefined;

          return (
            <Card
              key={item.id}
              className="border-border/50 shadow-sm rounded-2xl overflow-hidden"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-secondary px-2 py-1 rounded-md">
                    {category}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {source}
                  </span>
                </div>
                <CardTitle className="font-heading text-lg leading-tight">
                  {item.rank}. {title}
                </CardTitle>
                <CardDescription className="text-base">
                  {summary || "Open to read the full story."}
                </CardDescription>
                {url ? (
                  <div className="pt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4 text-xs"
                    >
                      <a href={url} target="_blank" rel="noreferrer">
                        Read Full Story{" "}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ) : null}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
