import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEventBySlug(slug: string) {
  await requireAdmin();

  return prisma.event.findUnique({
    where: { slug },
    select: {
      id: true,
      titleEn: true,
      titleAm: true,
      slug: true,
      descriptionEn: true,
      descriptionAm: true,
      category: true,
      startDate: true,
      image: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export type AdminEventDetailType = NonNullable<
  Awaited<ReturnType<typeof adminGetEventBySlug>>
>;

