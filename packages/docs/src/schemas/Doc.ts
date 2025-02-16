import { z } from "astro/zod";

export const DocSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});
