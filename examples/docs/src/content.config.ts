import { defineCollection } from "astro:content";
import { DocsSchema } from "@korhq/undocs";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/docs" }),
  schema: DocsSchema,
});

export const collections = { docs };
