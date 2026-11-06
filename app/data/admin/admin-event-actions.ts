"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { requireAdmin } from "./require-admin";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/event");
}

export async function deleteEvent(id: string): Promise<APIResponse> {
  await requireAdmin();

  try {
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return {
        status: "error",
        message: "Event not found.",
      };
    }

    await prisma.event.delete({
      where: { id },
    });

    refresh();

    return {
      status: "success",
      message: "Event deleted successfully.",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete event.",
    };
  }
}

export async function toggleEventPublished(
  id: string,
  isPublished: boolean,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    await prisma.event.update({
      where: { id },
      data: { isPublished },
    });

    refresh();

    return {
      status: "success",
      message: isPublished ? "Event published" : "Event unpublished",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update event",
    };
  }
}

