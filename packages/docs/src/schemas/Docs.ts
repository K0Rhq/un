import { z } from "astro/zod";

export const DocsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  directory: z.boolean().optional(),
});
