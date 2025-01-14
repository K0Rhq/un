import { defineCollection } from "astro:content";
import { PreviewSchema } from "@korhq/unpreview";
import { glob } from "astro/loaders";

const previews = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/previews" }),
	schema: PreviewSchema,
});

export const collections = { previews };
