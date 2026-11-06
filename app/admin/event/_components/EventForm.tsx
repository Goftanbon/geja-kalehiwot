"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AdminEventDetailType } from "@/app/data/admin/admin-get-event";
import { Uploader } from "@/components/file-uploader/Uploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/hooks/try-catch";
import {
  eventCategories,
  eventSchema,
  type EventFormValues,
  type EventSchemaType,
} from "@/lib/zodSchema";
import { CreateEvent } from "../create/action";
import { UpdateEvent } from "../[slug]/edit/action";

type EventFormProps = {
  event?: AdminEventDetailType;
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

function formatDatetimeLocal(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [resetKey, setResetKey] = useState(0);

  const defaultValues: EventFormValues = {
    titleEn: event?.titleEn ?? "",
    titleAm: event?.titleAm ?? "",
    slug: event?.slug ?? "",
    descriptionEn: event?.descriptionEn ?? "",
    descriptionAm: event?.descriptionAm ?? "",
    category: event?.category ?? "WORSHIP",
    startDate: formatDatetimeLocal(event?.startDate),
    image: event?.image ?? "",
    isPublished: event?.isPublished ?? false,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues, unknown, EventSchemaType>({
    resolver: zodResolver(eventSchema),
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

  const onSubmit = (values: EventSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        event ? UpdateEvent(event.id, values) : CreateEvent(values),
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (data?.status === "success") {
        toast.success(data.message);
        router.push("/admin/event");
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
          href="/admin/event"
          className={buttonVariants({ variant: "ghost", size: "icon" })}
          aria-label="Back to events"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {event ? "Edit Event" : "Create Event"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {event
              ? `Update details for "${event.titleEn}"`
              : "Add a new event to the church schedule"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* English Content */}
        <FormSection
          title="English Content"
          description="Basic information in English."
        >
          <Field
            htmlFor="titleEn"
            label="Title (English)"
            error={errors.titleEn?.message}
          >
            <Input
              id="titleEn"
              placeholder="e.g. Sunday Worship Service"
              {...register("titleEn")}
            />
          </Field>

          <Field
            htmlFor="descriptionEn"
            label="Description (English)"
            error={errors.descriptionEn?.message}
          >
            <Textarea
              id="descriptionEn"
              rows={4}
              placeholder="Describe the event, agenda, and expectations..."
              {...register("descriptionEn")}
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
              placeholder="የዝግጅቱ ርዕስ በአማርኛ"
              {...register("titleAm")}
            />
          </Field>

          <Field
            htmlFor="descriptionAm"
            label="Description (Amharic)"
            error={errors.descriptionAm?.message}
          >
            <Textarea
              id="descriptionAm"
              lang="am"
              rows={4}
              placeholder="የዝግጅቱ ዝርዝር መግለጫ..."
              {...register("descriptionAm")}
            />
          </Field>
        </FormSection>

        {/* Schedule & Classification */}
        <FormSection
          title="Schedule & Category"
          description="Set the event time, category, and URL slug."
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
                {eventCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              htmlFor="startDate"
              label="Start Date & Time"
              error={errors.startDate?.message}
            >
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate")}
              />
            </Field>
          </div>

          <Field htmlFor="slug" label="URL Slug" error={errors.slug?.message}>
            <div className="flex gap-2">
              <Input
                id="slug"
                placeholder="e.g. sunday-worship-service"
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
              Unique URL identifier, e.g. /events/sunday-worship-service
            </p>
          </Field>
        </FormSection>

        {/* Media */}
        <FormSection
          title="Event Poster / Image"
          description="Upload an event flyer or cover picture."
        >
          <Field label="Banner Image" error={errors.image?.message}>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <Uploader
                  key={`event-image-${resetKey}`}
                  fileTypeAccepted="image"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Field>
        </FormSection>

        {/* Publishing */}
        <FormSection
          title="Publishing Status"
          description="Choose whether this event is immediately visible to the public."
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="isPublished"
              className="size-4 rounded border-input accent-primary"
              {...register("isPublished")}
            />
            <span className="text-sm font-medium">
              Publish this event immediately
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
                {event ? "Saving..." : "Creating..."}
              </>
            ) : event ? (
              "Update Event"
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

