"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { homeSlideSchema, HomeSlideSchemaType } from "@/lib/zodSchema";

export async function CreateHomeSlide(
  values: HomeSlideSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    // Never trust the client: validate again on the server
    const validation = homeSlideSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const data = validation.data;
    const isImage = data.mediaType === "IMAGE";

    await prisma.homeSlide.create({
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

        // Only keep the fields that belong to the chosen media type, so a
        // leftover value from the other type is never saved. Values are S3 keys.
        image: isImage ? data.image || null : null,
        imageAlt: isImage ? data.imageAlt || null : null,
        video: isImage ? null : data.video || null,
        videoPoster: isImage ? null : data.videoPoster || null,

        gradient: data.gradient,

        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      },
    });

    // Refresh the homepage and the admin list so the new slide shows up
    revalidatePath("/");
    revalidatePath("/admin/carousel");

    return {
      status: "success",
      message: "Carousel slide created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create carousel slide",
    };
  }
}
