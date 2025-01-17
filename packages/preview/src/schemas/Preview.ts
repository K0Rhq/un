import { z } from "astro/zod";

export const PreviewSchema = z.object({
  /**
   * The name/title of your component.
   */
  title: z.string(),
  directory: z.boolean().optional(),
  props: z
    .record(
      z.string(),
      z.object({
        value: z.any(),
        type: z.enum(["union", "boolean", "string", "number"]),
        options: z.array(z.any()).optional(),
      }),
    )
    .optional(),
});
