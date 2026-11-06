import { GalleryHorizontalEnd, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { adminGetHomeSlides } from "@/app/data/admin/admin-get-home-slides";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CarouselCard, CarouselCardSkeleton } from "./_components/CarouselCard";

async function CarouselContent() {
  const slides = await adminGetHomeSlides();

  if (slides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <GalleryHorizontalEnd className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No slides yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first slide to show it on the homepage carousel.
          </p>
        </div>
        <Link href="/admin/carousel/create" className={buttonVariants()}>
          <Plus className="mr-2 size-4" />
          Create Carousel
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {slides.map((slide) => (
        <CarouselCard key={slide.id} slide={slide} />
      ))}
    </div>
  );
}

function CarouselGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <CarouselCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function CarouselPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carousels</h1>
          <p className="text-sm text-muted-foreground">
            Manage the slides shown on your homepage, in display order.
          </p>
        </div>
        <Link
          className={cn(buttonVariants(), "shrink-0")}
          href="/admin/carousel/create"
        >
          <Plus className="mr-2 size-4" />
          Create Carousel
        </Link>
      </div>

      <Suspense fallback={<CarouselGridSkeleton />}>
        <CarouselContent />
      </Suspense>
    </div>
  );
}
