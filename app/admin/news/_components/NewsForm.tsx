"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AdminNewsDetailType } from "@/app/data/admin/admin-get-news-detail";
import { Uploader } from "@/components/file-uploader/Uploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/hooks/try-catch";
import {
  newsCategories,
  newsSchema,
  type NewsFormValues,
  type NewsSchemaType,
} from "@/lib/zodSchema";
import { CreateNews } from "../create/action";
import { UpdateNews } from "../[slug]/edit/action";

type NewsFormProps = {
  news?: AdminNewsDetailType;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function Field({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor?: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewsForm({ news }: NewsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [resetKey, setResetKey] = useState(0);

  const defaultValues: NewsFormValues = {
    titleEn: news?.titleEn ?? "",
    titleAm: news?.titleAm ?? "",
    slug: news?.slug ?? "",
    excerptEn: news?.excerptEn ?? "",
    excerptAm: news?.excerptAm ?? "",
    contentEn: news?.contentEn ?? "",
    contentAm: news?.contentAm ?? "",
    author: news?.author ?? "",
    category: news?.category ?? "ANNOUNCEMENT",
    image: news?.image ?? "",
    isPublished: news?.isPublished ?? false,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormValues, unknown, NewsSchemaType>({
    resolver: zodResolver(newsSchema),
    defaultValues,
  });

  const titleEnValue = watch("titleEn");

  const handleGenerateSlug = () => {
    if (titleEnValue) {
      setValue("slug", slugify(titleEnValue), { shouldValidate: true });
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setResetKey((key) => key + 1);
  };

  const onSubmit = (values: NewsSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        news ? UpdateNews(news.id, values) : CreateNews(values),
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/admin/news");
        router.refresh();
      } else if (data?.status === "error") {
        toast.error(data.message);
      }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          aria-label="Back to news"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {news ? "Edit News Article" : "Create News Article"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {news
              ? `Update details for "${news.titleEn}"`
              : "Publish church announcements, stories, and ministry updates"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* English Content */}
        <FormSection
          title="English Content"
          description="Title, summary excerpt, and full story in English."
        >
          <Field
            htmlFor="titleEn"
            label="Title (English)"
            error={errors.titleEn?.message}
          >
            <Input
              id="titleEn"
              placeholder="e.g. New season of Sunday school begins"
              {...register("titleEn")}
            />
          </Field>

          <Field
            htmlFor="excerptEn"
            label="Excerpt / Brief Summary (English)"
            error={errors.excerptEn?.message}
          >
            <Textarea
              id="excerptEn"
              rows={3}
              placeholder="A short 1-2 sentence preview for cards and summaries..."
              {...register("excerptEn")}
            />
          </Field>

          <Field
            htmlFor="contentEn"
            label="Full Content (English)"
            error={errors.contentEn?.message}
          >
            <Textarea
              id="contentEn"
              rows={8}
              placeholder="The full article text, details, guidelines..."
              {...register("contentEn")}
            />
          </Field>
        </FormSection>

        {/* Amharic Content */}
        <FormSection
          title="Amharic Content"
          description="Translations in Amharic (optional)."
        >
          <Field
            htmlFor="titleAm"
            label="Title (Amharic)"
            error={errors.titleAm?.message}
          >
            <Input
              id="titleAm"
              lang="am"
              placeholder="የዜናው ርዕስ በአማርኛ"
              {...register("titleAm")}
            />
          </Field>

          <Field
            htmlFor="excerptAm"
            label="Excerpt / Brief Summary (Amharic)"
            error={errors.excerptAm?.message}
          >
            <Textarea
              id="excerptAm"
              lang="am"
              rows={3}
              placeholder="አጭር ማጠቃለያ..."
              {...register("excerptAm")}
            />
          </Field>

          <Field
            htmlFor="contentAm"
            label="Full Content (Amharic)"
            error={errors.contentAm?.message}
          >
            <Textarea
              id="contentAm"
              lang="am"
              rows={8}
              placeholder="ሙሉ የዜናው ይዘት..."
              {...register("contentAm")}
            />
          </Field>
        </FormSection>

        {/* Metadata & Classification */}
        <FormSection
          title="Classification & Author"
          description="Category, author byline, and custom URL slug."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              htmlFor="category"
              label="Category"
              error={errors.category?.message}
            >
              <select
                id="category"
                {...register("category")}
                className={selectClass}
              >
                {newsCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat
                      .split("_")
                      .map(
                        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              htmlFor="author"
              label="Author / Ministry Byline"
              error={errors.author?.message}
            >
              <Input
                id="author"
                placeholder="e.g. Media Ministry, Communications Team"
                {...register("author")}
              />
            </Field>
          </div>

          <Field htmlFor="slug" label="URL Slug" error={errors.slug?.message}>
            <div className="flex gap-2">
              <Input
                id="slug"
                placeholder="e.g. new-season-sunday-school"
                {...register("slug")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateSlug}
                title="Generate slug from English title"
              >
                <Sparkles className="mr-1.5 size-4" />
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Unique URL identifier, e.g. /news/new-season-sunday-school
            </p>
          </Field>
        </FormSection>

        {/* Media */}
        <FormSection
          title="Featured Image"
          description="Upload an article thumbnail or cover picture."
        >
          <Field label="Cover Image" error={errors.image?.message}>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <Uploader
                  key={`news-image-${resetKey}`}
                  fileTypeAccepted="image"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Publishing Status */}
        <FormSection
          title="Publishing Status"
          description="Choose whether this news article is visible to the public."
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="isPublished"
              className="size-4 rounded border-input accent-primary"
              {...register("isPublished")}
            />
            <span className="text-sm font-medium">
              Publish this article immediately
            </span>
          </label>
        </FormSection>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isPending}
          >
            Reset
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {news ? "Saving..." : "Creating..."}
              </>
            ) : news ? (
              "Update News"
            ) : (
              "Create News"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

