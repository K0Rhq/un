import { defineCollection } from "astro:content";
import { DocsSchema, reactPreviewLoader } from "@korhq/undocs";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { VariantsSchema } from "@korhq/undocs";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

const previews = defineCollection({
  loader: reactPreviewLoader({ previewsDir: "src/previews" }),
  schema: z
    .object({
      title: z.string().optional(),
      component: z.string().optional(),
      directory: z.boolean().optional(),
      variants: VariantsSchema.optional(),
    })
    .passthrough(),
});

export const collections = { docs, previews };
