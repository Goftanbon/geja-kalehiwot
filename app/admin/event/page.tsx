import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { adminGetEvents } from "@/app/data/admin/admin-get-events";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EventCard, EventCardSkeleton } from "./_components/EventCard";

async function EventContent() {
  const events = await adminGetEvents();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border px-6 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <CalendarDays className="size-6 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No events yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first event to show it on the church calendar and website.
          </p>
        </div>
        <Link href="/admin/event/create" className={buttonVariants()}>
          <Plus className="mr-2 size-4" />
          Create Event
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">
            Manage upcoming church events, conferences, and gatherings.
          </p>
        </div>
        <Link
          className={cn(buttonVariants(), "shrink-0")}
          href="/admin/event/create"
        >
          <Plus className="mr-2 size-4" />
          Create Event
        </Link>
      </div>

      <Suspense fallback={<EventGridSkeleton />}>
        <EventContent />
      </Suspense>
    </div>
  );
}

