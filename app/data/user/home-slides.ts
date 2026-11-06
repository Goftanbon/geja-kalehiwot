import "server-only";

import { prisma } from "@/lib/db";

export async function getPublishedHomeSlides() {
  try {
    return await prisma.homeSlide.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        titleEn: true,
        subtitleEn: true,
        primaryLabelEn: true,
        secondaryLabelEn: true,
        titleAm: true,
        subtitleAm: true,
        primaryLabelAm: true,
        secondaryLabelAm: true,
        primaryHref: true,
        secondaryHref: true,
        mediaType: true,
        image: true,
        imageAlt: true,
        video: true,
        videoPoster: true,
        gradient: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch homepage carousel slides:", error);
    return null;
  }
}

export type PublishedHomeSlide = NonNullable<
  Awaited<ReturnType<typeof getPublishedHomeSlides>>
>[number];

