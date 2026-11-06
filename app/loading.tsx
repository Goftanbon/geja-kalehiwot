import { HeroCarouselSkeleton } from "./_components/HeroCarouselSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header shell matching site layout */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-3 sm:h-20 sm:gap-4 sm:px-8">
          <div className="size-9 rounded-md bg-muted animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-full bg-muted animate-pulse" />
            <div className="hidden space-y-1 sm:block">
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
              <div className="h-2 w-16 rounded bg-muted/60 animate-pulse" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-4 lg:flex">
              <div className="h-4 w-12 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-12 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-16 rounded bg-muted/60 animate-pulse" />
            </div>
            <div className="h-8 w-12 rounded bg-muted animate-pulse" />
            <div className="size-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>

      <main>
        <HeroCarouselSkeleton />

        {/* Events skeleton */}
        <section className="bg-muted/40 py-20 mt-8">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <div className="mx-auto h-8 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="mx-auto h-4 w-80 rounded bg-muted/60 animate-pulse" />
          </div>
          <div className="relative mx-auto mt-12 max-w-[1700px]">
            <div className="flex gap-5 overflow-hidden px-4 pb-2 sm:px-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[88%] shrink-0 sm:w-[55%] lg:w-[42%]"
                >
                  <div className="aspect-[16/9] w-full rounded-xl bg-muted animate-pulse" />
                  <div className="mt-3 h-5 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="mt-2 h-4 w-1/2 rounded bg-muted/60 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

