import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEvents() {
  await requireAdmin();

  const data = await prisma.event.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
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

  return data;
}

export type AdminEventType = Awaited<ReturnType<typeof adminGetEvents>>[number];

