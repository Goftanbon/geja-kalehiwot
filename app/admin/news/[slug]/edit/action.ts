"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { APIResponse } from "@/lib/types";
import { newsSchema, NewsSchemaType } from "@/lib/zodSchema";

export async function UpdateNews(
  id: string,
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

    const existing = await prisma.news.findUnique({
      where: { id },
      select: { id: true, slug: true, isPublished: true, publishedAt: true },
    });

    if (!existing) {
      return {
        status: "error",
        message: "News article not found",
      };
    }

    // Check slug uniqueness if slug changed
    if (data.slug !== existing.slug) {
      const slugTaken = await prisma.news.findUnique({
        where: { slug: data.slug },
        select: { id: true },
      });

      if (slugTaken) {
        return {
          status: "error",
          message:
            "A news article with this slug already exists. Please choose a different slug.",
        };
      }
    }

    // Determine publishedAt
    let publishedAt = existing.publishedAt;
    if (data.isPublished && !existing.isPublished && !publishedAt) {
      publishedAt = new Date();
    } else if (!data.isPublished) {
      publishedAt = null;
    }

    await prisma.news.update({
      where: { id },
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
        publishedAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${data.slug}/edit`);
    if (existing.slug !== data.slug) {
      revalidatePath(`/admin/news/${existing.slug}/edit`);
    }

    return {
      status: "success",
      message: "News article updated successfully",
    };
  } catch (err) {
    console.error("Failed to update news article:", err);
    return {
      status: "error",
      message: "Failed to update news article",
    };
  }
}

