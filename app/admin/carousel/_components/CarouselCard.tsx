export function CarouselCardSkeleton() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-muted/60 p-5 flex flex-col justify-between border border-border/40">
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
        <div className="size-8 rounded-full bg-muted animate-pulse" />
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
        </div>
        <div className="size-10 rounded-full bg-muted animate-pulse shrink-0" />
      </div>
    </div>
  );
}
