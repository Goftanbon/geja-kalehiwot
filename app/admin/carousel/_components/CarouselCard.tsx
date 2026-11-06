"use client";

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  Trash2,
  Video,
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
  deleteHomeSlide,
  toggleHomeSlidePublished,
} from "@/app/data/admin/admin-home-slide-actions";
import type { AdminHomeSlideType } from "@/app/data/admin/admin-get-home-slides";
import { useContructUrl } from "@/hooks/use-construct-url";
import { cn } from "@/lib/utils";

// Fallback background when a slide has no picture (matches the SlideGradient enum)
const GRADIENTS: Record<AdminHomeSlideType["gradient"], string> = {
  BLUE_DARK: "from-[#172b4d] via-[#1555bf] to-black",
  BLUE: "from-[#1555bf] via-[#4f83d1] to-[#172b4d]",
  BLUE_GOLD: "from-[#172b4d] via-[#1555bf] to-[#d6a84b]",
};

const iconButton =
  "flex size-8 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md transition disabled:opacity-60";

export function CarouselCard({ slide }: { slide: AdminHomeSlideType }) {
  // For video slides the card shows the poster image
  const mediaKey =
    slide.mediaType === "IMAGE" ? slide.image : slide.videoPoster;
  const url = useContructUrl(mediaKey ?? "");

  const [isDeleting, startDelete] = useTransition();
  const [isToggling, startToggle] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startDelete(async () => {
      const result = await deleteHomeSlide(slide.id);

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
      const result = await toggleHomeSlidePublished(
        slide.id,
        !slide.isPublished,
      );

      if (result.status === "success") toast.success(result.message);
      else toast.error(result.message);
    });
  };

  const MediaIcon = slide.mediaType === "VIDEO" ? Video : ImageIcon;

  return (
    <article className="group relative min-h-[320px] overflow-hidden rounded-2xl bg-muted ring-1 ring-border sm:min-h-[360px]">
      {/* Background: picture or gradient fallback */}
      {mediaKey ? (
        <img
          src={url}
          alt={slide.imageAlt || slide.titleEn}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            GRADIENTS[slide.gradient],
          )}
        />
      )}

      {/* Two-sided gradient so the badges (top) and the text (bottom) stay
          readable whatever the photo looks like */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Top-left: status + media type + order */}
      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white ring-1 ring-inset ring-white/15 backdrop-blur-md",
            slide.isPublished ? "bg-emerald-500/80" : "bg-black/55",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              slide.isPublished ? "bg-white" : "bg-amber-400",
            )}
          />
          {slide.isPublished ? "Published" : "Draft"}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white ring-1 ring-inset ring-white/15 backdrop-blur-md">
          <MediaIcon size={11} />
          {slide.mediaType === "VIDEO" ? "Video" : "Image"}
          <span className="text-white/50">·</span>#{slide.sortOrder}
        </span>
      </div>

      {/* Top-right: publish toggle + delete */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={slide.isPublished ? "Unpublish slide" : "Publish slide"}
          title={slide.isPublished ? "Unpublish" : "Publish"}
          className={cn(iconButton, "hover:bg-white/25")}
        >
          {isToggling ? (
            <Loader2 size={14} className="animate-spin" />
          ) : slide.isPublished ? (
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
                aria-label={`Delete ${slide.titleEn}`}
                className={cn(iconButton, "hover:bg-destructive")}
              />
            }
          >
            <Trash2 size={14} />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this slide?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{slide.titleEn}&rdquo; will be removed from the homepage
                carousel. This can&apos;t be undone.
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

      {/* Bottom: titles, subtitle, buttons, edit link */}
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-2xl font-medium tracking-tight">
            {slide.titleEn}
          </h3>
          <p lang="am" className="mt-0.5 line-clamp-1 text-sm text-white/80">
            {slide.titleAm}
          </p>
          <p className="mt-2 line-clamp-2 text-xs text-white/70">
            {slide.subtitleEn}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-black">
              {slide.primaryLabelEn}
              <span className="font-normal text-black/50">
                {slide.primaryHref}
              </span>
            </span>

            {slide.secondaryLabelEn && slide.secondaryHref && (
              <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-md">
                {slide.secondaryLabelEn}
                <span className="font-normal text-white/60">
                  {slide.secondaryHref}
                </span>
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/admin/carousel/${slide.id}/edit`}
          aria-label={`Edit ${slide.titleEn}`}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition group-hover:bg-brand group-hover:text-brand-foreground"
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </article>
  );
}

export function CarouselCardSkeleton() {
  return (
    <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-muted/60 p-5 sm:min-h-[360px]">
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
          <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}
