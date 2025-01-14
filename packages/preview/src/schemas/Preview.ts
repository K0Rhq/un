import { z } from "astro/zod";

export const PreviewSchema = z.object({
	/**
	 * The name/title of your component.
	 */
	title: z.string(),
	directory: z.boolean().optional(),
});
