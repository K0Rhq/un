import { z } from "astro/zod";

export const StorySchema = z.object({
	/*
	 * String. The name/title of your component.
	 */
	title: z.string(),
});
