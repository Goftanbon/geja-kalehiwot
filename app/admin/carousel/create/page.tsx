"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { tryCatch } from "@/hooks/try-catch";
import {
  homeSlideSchema,
  slideGradients,
  slideMediaTypes,
  type HomeSlideFormValues,
  type HomeSlideSchemaType,
} from "@/lib/zodSchema";

// import { CreateHomeSlide } from "./action";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="text-sm text-destructive">{message}</p>;
}

// One labelled form field: label + control + error, with a consistent gap
function Field({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor: string;
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

// A bordered card that groups related fields
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
    <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6">
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

export default function CarouselCreationPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<HomeSlideFormValues, unknown, HomeSlideSchemaType>({
    resolver: zodResolver(homeSlideSchema),
    defaultValues: {
      titleEn: "",
      subtitleEn: "",
      primaryLabelEn: "",
      secondaryLabelEn: "",

      titleAm: "",
      subtitleAm: "",
      primaryLabelAm: "",
      secondaryLabelAm: "",

      primaryHref: "",
      secondaryHref: "",

      mediaType: "IMAGE",
      image: "",
      imageAlt: "",
      video: "",
      videoPoster: "",

      gradient: "BLUE_DARK",

      sortOrder: 0,
      isPublished: false,
    },
  });

  const mediaType = watch("mediaType");

  const onSubmit = (values: HomeSlideSchemaType) => {
    startTransition(async () => {
      //   const { data, error } = await tryCatch(CreateHomeSlide(values));
      //   if (error) {
      //     toast.error("An unexpected error occurred");
      //     return;
      //   }
      //   if (data?.status === "success") {
      //     toast.success(data.message);
      //     reset();
      //     router.push("/admin/carousel");
      //   } else if (data?.status === "error") {
      //     toast.error(data.message);
      //   }
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/carousel"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Create Carousel</h1>
          <p className="text-sm text-muted-foreground">
            Add a new slide to your homepage carousel.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* English content */}
        <FormSection
          title="English Content"
          description="Enter the English text displayed on this slide."
        >
          <Field
            htmlFor="titleEn"
            label="Title"
            error={errors.titleEn?.message}
          >
            <Input id="titleEn" {...register("titleEn")} />
          </Field>

          <Field
            htmlFor="subtitleEn"
            label="Subtitle"
            error={errors.subtitleEn?.message}
          >
            <Textarea id="subtitleEn" rows={3} {...register("subtitleEn")} />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              htmlFor="primaryLabelEn"
              label="Primary Button Label"
              error={errors.primaryLabelEn?.message}
            >
              <Input id="primaryLabelEn" {...register("primaryLabelEn")} />
            </Field>

            <Field
              htmlFor="secondaryLabelEn"
              label="Secondary Button Label"
              error={errors.secondaryLabelEn?.message}
            >
              <Input id="secondaryLabelEn" {...register("secondaryLabelEn")} />
            </Field>
          </div>
        </FormSection>

        {/* Amharic content (lang="am" makes the browser use the Ethiopic font) */}
        <FormSection
          title="Amharic Content"
          description="Enter the Amharic translation for this slide."
        >
          <Field
            htmlFor="titleAm"
            label="Title"
            error={errors.titleAm?.message}
          >
            <Input id="titleAm" lang="am" {...register("titleAm")} />
          </Field>

          <Field
            htmlFor="subtitleAm"
            label="Subtitle"
            error={errors.subtitleAm?.message}
          >
            <Textarea
              id="subtitleAm"
              lang="am"
              rows={3}
              {...register("subtitleAm")}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              htmlFor="primaryLabelAm"
              label="Primary Button Label"
              error={errors.primaryLabelAm?.message}
            >
              <Input
                id="primaryLabelAm"
                lang="am"
                {...register("primaryLabelAm")}
              />
            </Field>

            <Field
              htmlFor="secondaryLabelAm"
              label="Secondary Button Label"
              error={errors.secondaryLabelAm?.message}
            >
              <Input
                id="secondaryLabelAm"
                lang="am"
                {...register("secondaryLabelAm")}
              />
            </Field>
          </div>
        </FormSection>

        {/* Button destinations */}
        <FormSection
          title="Button Destinations"
          description="Specify where the carousel buttons should navigate."
        >
          <Field
            htmlFor="primaryHref"
            label="Primary Button URL"
            error={errors.primaryHref?.message}
          >
            <Input
              id="primaryHref"
              placeholder="/about"
              {...register("primaryHref")}
            />
          </Field>

          <Field
            htmlFor="secondaryHref"
            label="Secondary Button URL"
            error={errors.secondaryHref?.message}
          >
            <Input
              id="secondaryHref"
              placeholder="/contact"
              {...register("secondaryHref")}
            />
          </Field>
        </FormSection>

        {/* Background media */}
        <FormSection
          title="Background Media"
          description="Choose an image or video for your carousel background."
        >
          <Field
            htmlFor="mediaType"
            label="Media Type"
            error={errors.mediaType?.message}
          >
            <select
              id="mediaType"
              {...register("mediaType")}
              className={selectClass}
            >
              {slideMediaTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          {mediaType === "IMAGE" && (
            <>
              <Field
                htmlFor="image"
                label="Image URL"
                error={errors.image?.message}
              >
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  {...register("image")}
                />
              </Field>

              <Field
                htmlFor="imageAlt"
                label="Image Alt Text"
                error={errors.imageAlt?.message}
              >
                <Input
                  id="imageAlt"
                  placeholder="Description of the background image"
                  {...register("imageAlt")}
                />
              </Field>
            </>
          )}

          {mediaType === "VIDEO" && (
            <>
              <Field
                htmlFor="video"
                label="Video URL"
                error={errors.video?.message}
              >
                <Input
                  id="video"
                  placeholder="https://example.com/video.mp4"
                  {...register("video")}
                />
              </Field>

              <Field
                htmlFor="videoPoster"
                label="Video Poster URL"
                error={errors.videoPoster?.message}
              >
                <Input
                  id="videoPoster"
                  placeholder="https://example.com/poster.jpg"
                  {...register("videoPoster")}
                />
              </Field>
            </>
          )}
        </FormSection>

        {/* Appearance */}
        {/* <FormSection
          title="Appearance"
          description="Choose the gradient overlay for the slide."
        >
          <Field
            htmlFor="gradient"
            label="Gradient"
            error={errors.gradient?.message}
          >
            <select
              id="gradient"
              {...register("gradient")}
              className={selectClass}
            >
              {slideGradients.map((gradient) => (
                <option key={gradient} value={gradient}>
                  {gradient.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </Field>
        </FormSection> */}

        {/* Management */}
        <FormSection
          title="Management"
          description="Configure the slide's display order and publication status."
        >
          <Field
            htmlFor="sortOrder"
            label="Display Order"
            error={errors.sortOrder?.message}
          >
            <Input
              id="sortOrder"
              type="number"
              min={0}
              {...register("sortOrder", { valueAsNumber: true })}
            />
          </Field>

          <div className="flex items-center gap-3">
            <input
              id="isPublished"
              type="checkbox"
              className="size-4 accent-primary"
              {...register("isPublished")}
            />
            <Label htmlFor="isPublished">Publish this slide immediately</Label>
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isPending}
          >
            Reset
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Carousel"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
