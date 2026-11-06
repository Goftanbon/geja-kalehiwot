"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { requireAdmin } from "./require-admin";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/carousel");
}

export async function deleteHomeSlide(id: string): Promise<APIResponse> {
  await requireAdmin();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check how many carousel slides exist
      const slideCount = await tx.homeSlide.count();

      // Never allow deleting the last slide
      if (slideCount <= 1) {
        return {
          status: "error" as const,
          message: "You cannot delete the last carousel slide.",
        };
      }

      // Check whether the requested slide exists
      const slide = await tx.homeSlide.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!slide) {
        return {
          status: "error" as const,
          message: "Carousel slide not found.",
        };
      }

      await tx.homeSlide.delete({
        where: { id },
      });

      return {
        status: "success" as const,
        message: "Carousel slide deleted successfully.",
      };
    });

    if (result.status === "success") {
      refresh();
    }

    return result;
  } catch {
    return {
      status: "error",
      message: "Failed to delete carousel slide.",
    };
  }
}

export async function toggleHomeSlidePublished(
  id: string,
  isPublished: boolean,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    await prisma.homeSlide.update({
      where: { id },
      data: { isPublished },
    });
    refresh();

    return {
      status: "success",
      message: isPublished ? "Slide published" : "Slide unpublished",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update the slide",
    };
  }
}
