import { Suspense } from "react";
// import { adminGetDestinations } from "@/app/data/admin/admin-get-destinations";
import {
  //   DestinationCard,
  CarouselCardSkeleton,
} from "./_components/CarouselCard";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

async function CarouselContent() {
  //   const data = await adminGetDestinations();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* {data.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))} */}
    </div>
  );
}

function CarouselGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CarouselCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function CarouselPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Carousels</h1>
        <Link className={buttonVariants()} href="/admin/carousel/create">
          Create Carousel
        </Link>
      </div>
      <Suspense fallback={<CarouselGridSkeleton />}>
        <CarouselContent />
      </Suspense>
    </div>
  );
}
