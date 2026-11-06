import "server-only";

import { prisma } from "@/lib/db";

export async function getUpcomingHomeEvents() {
  try {
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
    console.error("Failed to fetch upcoming homepage events:", error);
    return null;
  }
}

export type UpcomingHomeEvent = NonNullable<
  Awaited<ReturnType<typeof getUpcomingHomeEvents>>
>[number];

