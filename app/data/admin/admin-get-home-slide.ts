import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetHomeSlide(id: string) {
  await requireAdmin();

  return prisma.homeSlide.findUnique({
    where: { id },
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
      sortOrder: true,
      isPublished: true,
    },
  });
}

export type AdminHomeSlideDetailType = NonNullable<
  Awaited<ReturnType<typeof adminGetHomeSlide>>
>;
