import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetNews() {
  await requireAdmin();

  const data = await prisma.news.findMany({
    orderBy: [{ createdAt: "desc" }],
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

  return data;
}

export type AdminNewsType = Awaited<ReturnType<typeof adminGetNews>>[number];

