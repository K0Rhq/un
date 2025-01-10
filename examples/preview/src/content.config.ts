import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { storySchema } from "@korhq/unpreview";

const stories = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/stories" }),
  schema: storySchema,
});

export const collections = { stories };
