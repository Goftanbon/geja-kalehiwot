import { z } from "zod";

export const slideGradients = ["BLUE_DARK", "BLUE", "BLUE_GOLD"] as const;

export const slideMediaTypes = ["IMAGE", "VIDEO"] as const;

// Treat empty optional form inputs as undefined
const optionalText = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().optional(),
);

export const homeSlideSchema = z
  .object({
    // English content
    titleEn: z.string().trim().min(3).max(100),
    subtitleEn: z.string().trim().min(3).max(1000),
    primaryLabelEn: z.string().trim().min(1).max(50),
    secondaryLabelEn: optionalText,

    // Amharic content
    titleAm: z.string().trim().min(3).max(100),
    subtitleAm: z.string().trim().min(3).max(1000),
    primaryLabelAm: z.string().trim().min(1).max(50),
    secondaryLabelAm: optionalText,

    // Button destinations
    primaryHref: z.string().trim().min(1).max(500),
    secondaryHref: optionalText,

    // Media
    mediaType: z.enum(slideMediaTypes),
    image: optionalText,
    imageAlt: optionalText,
    video: optionalText,
    videoPoster: optionalText,

    // Styling
    gradient: z.enum(slideGradients),

    // Management
    sortOrder: z.coerce.number().int().min(0),
    isPublished: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // Require the appropriate media URL
    if (data.mediaType === "IMAGE" && !data.image) {
      ctx.addIssue({
        code: "custom",
        path: ["image"],
        message: "Image URL is required",
      });
    }

    if (data.mediaType === "VIDEO" && !data.video) {
      ctx.addIssue({
        code: "custom",
        path: ["video"],
        message: "Video URL is required",
      });
    }

    // Secondary button label and URL should be provided together
    const hasSecondaryLabel =
      !!data.secondaryLabelEn && !!data.secondaryLabelAm;
    const hasSecondaryHref = !!data.secondaryHref;

    if (hasSecondaryLabel !== hasSecondaryHref) {
      ctx.addIssue({
        code: "custom",
        path: ["secondaryHref"],
        message: "Provide both secondary button labels and its URL",
      });
    }
  });

export type HomeSlideFormValues = z.input<typeof homeSlideSchema>;
export type HomeSlideSchemaType = z.output<typeof homeSlideSchema>;
