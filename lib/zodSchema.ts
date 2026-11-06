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
    image: z.string().optional(), // S3 key
    imageAlt: z.string().optional(), // generated, not typed
    video: z.string().optional(), // S3 key
    videoPoster: z.string().optional(), // S3 key

    // Styling
    gradient: z.enum(slideGradients),

    // Management
    sortOrder: z.coerce.number().int().min(0),
    isPublished: z.boolean().default(false),
  })
  .superRefine((v, ctx) => {
    if (v.mediaType === "IMAGE" && !v.image) {
      ctx.addIssue({
        code: "custom",
        path: ["image"],
        message: "Please upload an image",
      });
    }
    if (v.mediaType === "VIDEO") {
      if (!v.video) {
        ctx.addIssue({
          code: "custom",
          path: ["video"],
          message: "Please upload a video",
        });
      }
      if (!v.videoPoster) {
        ctx.addIssue({
          code: "custom",
          path: ["videoPoster"],
          message: "Please upload a poster image",
        });
      }
    }
  });
// .superRefine((v, ctx) => {
//   // Require the appropriate media URL
//   // if (data.mediaType === "IMAGE" && !data.image) {
//   //   ctx.addIssue({
//   //     code: "custom",
//   //     path: ["image"],
//   //     message: "Image URL is required",
//   //   });
//   // }

//   // if (data.mediaType === "VIDEO" && !data.video) {
//   //   ctx.addIssue({
//   //     code: "custom",
//   //     path: ["video"],
//   //     message: "Video URL is required",
//   //   });
//   // }
//   if (v.mediaType === "IMAGE" && !v.image) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["image"],
//       message: "Please upload an image",
//     });
//   }
//   if (v.mediaType === "VIDEO") {
//     if (!v.video) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["video"],
//         message: "Please upload a video",
//       });
//     }
//     if (!v.videoPoster) {
//       ctx.addIssue({
//         code: "custom",
//         path: ["videoPoster"],
//         message: "Please upload a poster image",
//       });
//     }
//   }

//   // Secondary button label and URL should be provided together
//   const hasSecondaryLabel =
//     !!data.secondaryLabelEn && !!data.secondaryLabelAm;
//   const hasSecondaryHref = !!data.secondaryHref;

//   if (hasSecondaryLabel !== hasSecondaryHref) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["secondaryHref"],
//       message: "Provide both secondary button labels and its URL",
//     });
//   }
// });

export type HomeSlideFormValues = z.input<typeof homeSlideSchema>;
export type HomeSlideSchemaType = z.output<typeof homeSlideSchema>;
