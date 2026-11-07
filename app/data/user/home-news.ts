import "server-only";

import { prisma } from "@/lib/db";

export async function getPublishedHomeNews() {
  try {
    return await prisma.news.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        slug: true,
        excerptEn: true,
        excerptAm: true,
        contentEn: true,
        contentAm: true,
        image: true,
        author: true,
        category: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch homepage news:", error);
    return null;
  }
}

export async function getPublishedNewsBySlug(slug: string) {
  try {
    return await prisma.news.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        slug: true,
        excerptEn: true,
        excerptAm: true,
        contentEn: true,
        contentAm: true,
        image: true,
        author: true,
        category: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error(`Failed to fetch news article for slug "${slug}":`, error);
    return null;
  }
}

export type PublishedHomeNewsItem = NonNullable<
  Awaited<ReturnType<typeof getPublishedHomeNews>>
>[number];

