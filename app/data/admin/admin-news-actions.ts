"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { requireAdmin } from "./require-admin";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/news");
}

export async function deleteNews(id: string): Promise<APIResponse> {
  await requireAdmin();

  try {
    const existing = await prisma.news.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return {
        status: "error",
        message: "News article not found.",
      };
    }

    await prisma.news.delete({
      where: { id },
    });

    refresh();

    return {
      status: "success",
      message: "News article deleted successfully.",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete news article.",
    };
  }
}

export async function toggleNewsPublished(
  id: string,
  isPublished: boolean,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    await prisma.news.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    refresh();

    return {
      status: "success",
      message: isPublished ? "News published" : "News unpublished",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update news status",
    };
  }
}

