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
    await prisma.homeSlide.delete({ where: { id } });
    refresh();

    return {
      status: "success",
      message: "Carousel slide deleted",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete carousel slide",
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
