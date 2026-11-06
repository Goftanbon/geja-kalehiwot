import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetHomeSlides() {
  await requireAdmin();

  const data = await prisma.homeSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      titleEn: true,
      titleAm: true,
      subtitleEn: true,
      primaryLabelEn: true,
      primaryHref: true,
      secondaryLabelEn: true,
      secondaryHref: true,
      mediaType: true,
      image: true,
      imageAlt: true,
      videoPoster: true,
      gradient: true,
      sortOrder: true,
      isPublished: true,
    },
  });

  return data;
}

export type AdminHomeSlideType = Awaited<
  ReturnType<typeof adminGetHomeSlides>
>[number];
