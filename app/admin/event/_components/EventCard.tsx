"use client";

import {
  ArrowUpRight,
  CalendarDays,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Trash2,
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
  deleteEvent,
  toggleEventPublished,
} from "@/app/data/admin/admin-event-actions";
import type { AdminEventType } from "@/app/data/admin/admin-get-events";
import { useContructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";

const iconButton =
  "flex size-8 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md transition disabled:opacity-60";

const categoryStyles: Record<string, string> = {
  WORSHIP: "bg-blue-600/80 text-white",
  CONFERENCE: "bg-purple-600/80 text-white",
  YOUTH: "bg-emerald-600/80 text-white",
  OUTREACH: "bg-amber-600/80 text-white",
  PRAYER: "bg-rose-600/80 text-white",
  COMMUNITY: "bg-cyan-600/80 text-white",
  OTHER: "bg-neutral-600/80 text-white",
};

function formatEventDate(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventCard({ event }: { event: AdminEventType }) {
  const url = useContructUrl(event.image ?? "");

  const [isDeleting, startDelete] = useTransition();
  const [isToggling, startToggle] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startDelete(async () => {
      const result = await deleteEvent(event.id);

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
      const result = await toggleEventPublished(event.id, !event.isPublished);

      if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <article className="group relative min-h-[340px] overflow-hidden rounded-2xl bg-muted ring-1 ring-border sm:min-h-[380px]">
      {/* Background: picture or dark gradient fallback */}
      {event.image ? (
        <img
          src={url}
          alt={event.titleEn}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#172b4d] via-[#1555bf] to-neutral-900">
          <CalendarDays className="size-20 text-white/10" />
        </div>
      )}

      {/* Overlays for readable badges & text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top-left: status + category */}
      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white ring-1 ring-inset ring-white/15 backdrop-blur-md",
            event.isPublished ? "bg-emerald-500/80" : "bg-black/55",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              event.isPublished ? "bg-white" : "bg-amber-400",
            )}
          />
          {event.isPublished ? "Published" : "Draft"}
        </span>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-wide ring-1 ring-inset ring-white/15 backdrop-blur-md",
            categoryStyles[event.category] || "bg-black/55 text-white",
          )}
        >
          {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Top-right: publish toggle + delete */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={event.isPublished ? "Unpublish event" : "Publish event"}
          title={event.isPublished ? "Unpublish" : "Publish"}
          className={cn(iconButton, "hover:bg-white/25")}
        >
          {isToggling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : event.isPublished ? (
            <Eye size={14} />
          ) : (
            <EyeOff size={14} />
          )}
        </button>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger
            render={
              <button
                type="button"
                aria-label={`Delete ${event.titleEn}`}
                className={cn(iconButton, "hover:bg-destructive")}
              />
            }
          >
            <Trash2 size={14} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this event?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{event.titleEn}&rdquo; will be permanently deleted. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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

      {/* Bottom: Date, Titles, Description, Edit Link */}
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
            <CalendarDays size={13} />
            <span>{formatEventDate(event.startDate)}</span>
          </div>

          <h3 className="mt-1 line-clamp-1 text-2xl font-semibold tracking-tight">
            {event.titleEn}
          </h3>

          {event.titleAm && (
            <p lang="am" className="mt-0.5 line-clamp-1 text-sm text-white/80">
              {event.titleAm}
            </p>
          )}

          <p className="mt-2 line-clamp-2 text-xs text-white/70">
            {event.descriptionEn}
          </p>

          <div className="mt-2 text-[11px] text-white/50">
            slug: /{event.slug}
          </div>
        </div>

        <Link
          href={`/admin/event/${event.slug}/edit`}
          aria-label={`Edit ${event.titleEn}`}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 group-hover:bg-brand group-hover:text-brand-foreground"
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-muted/60 p-5 sm:min-h-[380px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="size-8 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

