"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { newsSchema, NewsSchemaType } from "@/lib/zodSchema";

export async function CreateNews(
  values: NewsSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validation = newsSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: validation.error.issues[0]?.message || "Invalid form data",
      };
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.news.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existing) {
      return {
        status: "error",
        message:
          "A news article with this slug already exists. Please choose a different slug.",
      };
    }

    await prisma.news.create({
      data: {
        titleEn: data.titleEn,
        titleAm: data.titleAm || null,
        slug: data.slug,
        excerptEn: data.excerptEn || null,
        excerptAm: data.excerptAm || null,
        contentEn: data.contentEn,
        contentAm: data.contentAm || null,
        author: data.author || null,
        category: data.category,
        image: data.image || null,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/news");

    return {
      status: "success",
      message: "News article created successfully",
    };
  } catch (err) {
    console.error("Failed to create news article:", err);
    return {
      status: "error",
      message: "Failed to create news article",
    };
  }
}

