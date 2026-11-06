export function HeroCarouselSkeleton() {
  return (
    <section className="mx-auto max-w-[1700px] sm:px-8">
      {/* hero aspect ratio matches 4/5 on mobile, 16/9 on desktop */}
      <div className="relative aspect-[4/5] max-h-[85vh] w-full overflow-hidden bg-neutral-900 text-white sm:aspect-[16/9]">
        {/* Shimmering pulse background */}
        <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        {/* Content placeholder matching hero layout */}
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-5xl flex-col gap-5 p-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
          <div className="space-y-3">
            <div className="h-7 w-60 rounded-lg bg-white/20 animate-pulse sm:h-9 sm:w-96" />
            <div className="h-4 w-44 rounded-md bg-white/10 animate-pulse sm:w-72" />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="h-11 w-32 rounded-lg bg-white/25 animate-pulse" />
            <div className="h-11 w-28 rounded-lg bg-white/15 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Dots skeleton */}
      <div className="mt-5 flex justify-center gap-2">
        <div className="h-2 w-5 rounded-full bg-foreground/25 animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-foreground/15 animate-pulse" />
      </div>
    </section>
  );
}

