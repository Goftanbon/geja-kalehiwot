"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { eventSchema, EventSchemaType } from "@/lib/zodSchema";

export async function UpdateEvent(
  id: string,
  values: EventSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validation = eventSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.issues[0]?.message || "Invalid form data",
      };
    }

    const data = validation.data;

    const existing = await prisma.event.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return {
        status: "error",
        message: "Event not found",
      };
    }

    // Check slug uniqueness if slug changed
    if (data.slug !== existing.slug) {
      const slugTaken = await prisma.event.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });

      if (slugTaken) {
        return {
          status: "error",
          message:
            "An event with this slug already exists. Please choose a different slug.",
        };
      }
    }

    await prisma.event.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        titleAm: data.titleAm || null,
        slug: data.slug,
        descriptionEn: data.descriptionEn,
        descriptionAm: data.descriptionAm || null,
        category: data.category,
        startDate: new Date(data.startDate),
        image: data.image || null,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/event");
    revalidatePath(`/admin/event/${data.slug}/edit`);
    if (existing.slug !== data.slug) {
      revalidatePath(`/admin/event/${existing.slug}/edit`);
    }

    return {
      status: "success",
      message: "Event updated successfully",
    };
  } catch (err) {
    console.error("Failed to update event:", err);
    return {
      status: "error",
      message: "Failed to update event",
    };
  }
}

