import { z } from "astro/zod";

// Define the variant option schema
export const VariantOptionSchema = z.object({
  title: z.string(),
  options: z.array(z.union([z.string(), z.boolean(), z.number()])),
  default: z.union([z.string(), z.boolean(), z.number()]),
});

// Define a schema for an array of variant options
export const VariantsSchema = z.array(VariantOptionSchema);

// Type for a single variant option, derived from the schema
export type VariantOption = z.infer<typeof VariantOptionSchema>;

// Type for an array of variant options, derived from the schema
export type Variants = z.infer<typeof VariantsSchema>;