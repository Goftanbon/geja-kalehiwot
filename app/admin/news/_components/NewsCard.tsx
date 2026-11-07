"use client";

import {
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteNews,
  toggleNewsPublished,
} from "@/app/data/admin/admin-news-actions";
import type { AdminNewsType } from "@/app/data/admin/admin-get-news";
import { useContructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";

const iconButton =
  "flex size-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition disabled:opacity-50";

function formatNewsDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function NewsCard({ news }: { news: AdminNewsType }) {
  const [isDeleting, startDelete] = useTransition();
  const [isToggling, startToggle] = useTransition();
  const [open, setOpen] = useState(false);

  const displayDate = formatNewsDate(news.publishedAt || news.createdAt);
  const imageUrl = useContructUrl(news.image ?? "");

  const handleDelete = () => {
    startDelete(async () => {
      const result = await deleteNews(news.id);

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleToggle = () => {
    startToggle(async () => {
      const result = await toggleNewsPublished(news.id, !news.isPublished);

      if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-md transition duration-300 hover:border-neutral-700">
      <div>
        {/* Admin Bar: Status, Category, and Action Buttons */}
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                news.isPublished
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/20 text-amber-400",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  news.isPublished ? "bg-emerald-400" : "bg-amber-400",
                )}
              />
              {news.isPublished ? "Published" : "Draft"}
            </span>

            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-neutral-300">
              {news.category
                .split("_")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(" ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggle}
              disabled={isToggling}
              aria-label={news.isPublished ? "Unpublish" : "Publish"}
              title={news.isPublished ? "Unpublish" : "Publish"}
              className={iconButton}
            >
              {isToggling ? (
                <Loader2 size={12} className="animate-spin" />
              ) : news.isPublished ? (
                <Eye size={13} />
              ) : (
                <EyeOff size={13} />
              )}
            </button>

            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger
                render={
                  <button
                    type="button"
                    aria-label={`Delete ${news.titleEn}`}
                    className={cn(iconButton, "hover:bg-destructive/80")}
                  />
                }
              >
                <Trash2 size={13} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this article?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &ldquo;{news.titleEn}&rdquo; will be permanently deleted. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Optional Thumbnail Image */}
        {imageUrl && (
          <div className="mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-800">
            <img
              src={imageUrl}
              alt={news.titleEn}
              loading="lazy"
              className="size-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Top: Date in Blue Uppercase (Matching provided design) */}
        <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
          {displayDate}
        </p>

        {/* Title */}
        <h3 className="mt-2 text-xl font-bold leading-snug text-white transition group-hover:text-blue-100">
          {news.titleEn}
        </h3>

        {/* Optional Amharic Title */}
        {news.titleAm && (
          <p lang="am" className="mt-1 line-clamp-1 text-sm text-neutral-300">
            {news.titleAm}
          </p>
        )}

        {/* Excerpt */}
        <p className="mt-2.5 text-sm leading-relaxed text-neutral-400 line-clamp-3">
          {news.excerptEn || news.contentEn}
        </p>

        {/* Author Byline if present */}
        {news.author && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
            <User size={12} />
            <span>{news.author}</span>
          </p>
        )}
      </div>

      {/* Bottom Link: Read more > */}
      <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between">
        <Link
          href={`/admin/news/${news.slug}/edit`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-white transition hover:text-blue-400"
        >
          <span>Read more</span>
          <ChevronRight size={16} />
        </Link>
        <span className="text-[10px] text-neutral-500">/{news.slug}</span>
      </div>
    </article>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-neutral-800/80 pb-3">
          <div className="h-5 w-20 animate-pulse rounded-full bg-neutral-800" />
          <div className="flex gap-1.5">
            <div className="size-7 animate-pulse rounded-full bg-neutral-800" />
            <div className="size-7 animate-pulse rounded-full bg-neutral-800" />
          </div>
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-neutral-800" />
        <div className="h-6 w-5/6 animate-pulse rounded bg-neutral-800" />
        <div className="h-4 w-full animate-pulse rounded bg-neutral-800/70" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-800/70" />
      </div>
      <div className="mt-6 h-5 w-24 animate-pulse rounded bg-neutral-800" />
    </div>
  );
}

