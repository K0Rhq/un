import { defineCollection } from "astro:content";
import { DocsSchema, reactComponentLoader } from "@korhq/undocs";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { VariantsSchema } from "@korhq/undocs";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

const previews = defineCollection({
  schema: z
    .object({
      title: z.string().optional(),
      component: z.string().optional(),
      directory: z.boolean().optional(),
      variants: VariantsSchema.optional(),
    })
    .passthrough(),
  loader: reactComponentLoader({ previewsDir: "src/previews" }),
});

export const collections = { docs, previews };
