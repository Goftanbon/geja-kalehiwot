"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { eventSchema, EventSchemaType } from "@/lib/zodSchema";

export async function CreateEvent(
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

    // Check slug uniqueness
    const existing = await prisma.event.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existing) {
      return {
        status: "error",
        message:
          "An event with this slug already exists. Please choose a different slug.",
      };
    }

    await prisma.event.create({
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

    return {
      status: "success",
      message: "Event created successfully",
    };
  } catch (err) {
    console.error("Failed to create event:", err);
    return {
      status: "error",
      message: "Failed to create event",
    };
  }
}

