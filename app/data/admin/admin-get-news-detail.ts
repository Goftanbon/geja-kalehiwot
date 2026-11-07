import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetNewsBySlug(slug: string) {
  await requireAdmin();

  return prisma.news.findUnique({
    where: { slug },
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
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export type AdminNewsDetailType = NonNullable<
  Awaited<ReturnType<typeof adminGetNewsBySlug>>
>;

