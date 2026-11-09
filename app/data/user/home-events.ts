import "server-only";

import { connection } from "next/server";
import { prisma } from "@/lib/db";

export async function getUpcomingHomeEvents() {
  try {
    await connection();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.event.findMany({
      where: {
        isPublished: true,
        startDate: {
          gte: today,
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: 4,
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        slug: true,
        startDate: true,
        image: true,
        category: true,
      },
    });
  } catch (error) {
    // Prerendering intentionally defers this fetch to request time via
    // connection(); the resulting hanging-promise rejection on the prerender
    // pass is expected and not a real failure, so don't log it as one.
    if (
      error instanceof Error &&
      (error as { digest?: string }).digest === "HANGING_PROMISE_REJECTION"
    ) {
      return null;
    }
    console.error("Failed to fetch upcoming homepage events:", error);
    return null;
  }
}

export type UpcomingHomeEvent = NonNullable<
  Awaited<ReturnType<typeof getUpcomingHomeEvents>>
>[number];

