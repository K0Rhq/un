import { defineCollection } from "astro:content";
import { DocsSchema } from "@korhq/undocs";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

// Custom loader for React (.tsx) files
function reactComponentLoader(): Loader {
  return {
    name: "react-component-loader",
    async load({ store }) {
      // Clear any existing entries
      store.clear();

      // This function returns paths in the format we need for dynamic imports
      function getComponentId(path: string): string {
        return path.split("/").pop() || "";
      }

      // Get all preview components with direct globbing
      const files = import.meta.glob<string>("./previews/**/*.tsx", {
        as: "url",
      });

      // Process each component
      for (const path in files) {
        const id = path.split("/").pop() || "";
        const slug = id.replace(/\.tsx$/, "").replace(/\.preview$/, "");

        // Store just the filename, which is all we need for renderReact
        store.set({
          id: slug,
          data: {
            title: slug,
            component: id,
          },
        });
      }
    },
  };
}

const previews = defineCollection({
  loader: reactComponentLoader(),
});

export const collections = { docs, previews };
