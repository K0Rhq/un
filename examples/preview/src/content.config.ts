import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { StorySchema } from "@korhq/unpreview";

const stories = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/stories" }),
  schema: StorySchema,
});

export const collections = { stories };
