import { Newspaper, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { adminGetNews } from "@/app/data/admin/admin-get-news";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewsCard, NewsCardSkeleton } from "./_components/NewsCard";

async function NewsContent() {
  const newsList = await adminGetNews();

  if (newsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Newspaper className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No news articles yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish your first church news article, announcement, or ministry update.
          </p>
        </div>
        <Link href="/admin/news/create" className={buttonVariants()}>
          <Plus className="mr-2 size-4" />
          Create News
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {newsList.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

function NewsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function AdminNewsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">News & Announcements</h1>
          <p className="text-sm text-muted-foreground">
            Manage church announcements, stories, testimonies, and ministry updates.
          </p>
        </div>
        <Link
          className={cn(buttonVariants(), "shrink-0")}
          href="/admin/news/create"
        >
          <Plus className="mr-2 size-4" />
          Create News
        </Link>
      </div>

      <Suspense fallback={<NewsGridSkeleton />}>
        <NewsContent />
      </Suspense>
    </div>
  );
}

