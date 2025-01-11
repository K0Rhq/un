import { defineCollection } from "astro:content";
import { StorySchema } from "@korhq/unpreview";
import { glob } from "astro/loaders";

const stories = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/stories" }),
	schema: StorySchema,
});

export const collections = { stories };
