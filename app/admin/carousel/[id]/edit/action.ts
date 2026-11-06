"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { homeSlideSchema, HomeSlideSchemaType } from "@/lib/zodSchema";

export async function UpdateHomeSlide(
  id: string,
  values: HomeSlideSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    // Validate the incoming data again on the server
    const validation = homeSlideSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const data = validation.data;
    const isImage = data.mediaType === "IMAGE";

    // Make sure the slide exists
    const existingSlide = await prisma.homeSlide.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingSlide) {
      return {
        status: "error",
        message: "Carousel slide not found",
      };
    }

    await prisma.homeSlide.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        subtitleEn: data.subtitleEn,
        primaryLabelEn: data.primaryLabelEn,
        secondaryLabelEn: data.secondaryLabelEn,

        titleAm: data.titleAm,
        subtitleAm: data.subtitleAm,
        primaryLabelAm: data.primaryLabelAm,
        secondaryLabelAm: data.secondaryLabelAm,

        primaryHref: data.primaryHref,
        secondaryHref: data.secondaryHref,

        mediaType: data.mediaType,

        // Only save fields belonging to the selected media type
        image: isImage ? data.image || null : null,
        imageAlt: isImage ? data.imageAlt || null : null,

        video: isImage ? null : data.video || null,
        videoPoster: isImage ? null : data.videoPoster || null,

        gradient: data.gradient,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/carousel");
    revalidatePath(`/admin/carousel/${id}/edit`);

    return {
      status: "success",
      message: "Carousel slide updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update carousel slide",
    };
  }
}
