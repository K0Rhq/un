import { atom } from "nanostores";
import type { PreviewSchema } from "@korhq/unpreview";
import type { z } from "astro:content";

type InferredPreviewSchema = z.infer<typeof PreviewSchema>;
export const componentProps = atom<InferredPreviewSchema["props"]>(undefined);
