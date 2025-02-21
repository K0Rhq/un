import { z } from "astro/zod";

export const PreviewSchema = z.object({
  title: z.string(),
  directory: z.boolean().optional(),
  variants: z
    .record(
      z.string(),
      z.object({
        default: z.any(),
        options: z.array(z.any()),
      }),
    )
    .optional(),
});
