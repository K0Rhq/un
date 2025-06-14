import { defineCollection } from "astro:content";
import { DocsSchema } from "@korhq/undocs";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

// Custom loader for React (.tsx) files and JSON files
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
      const tsxFiles = import.meta.glob<string>("./previews/**/*.tsx", {
        as: "url",
      });

      // Process each TSX component
      for (const path in tsxFiles) {
        // Extract the path relative to ./previews
        const relativePath = path.replace("./previews/", "");
        // Get the directory structure
        const pathParts = relativePath.split("/");
        // The filename is the last part
        const filename = pathParts.pop() || "";
        // Create an ID that includes the directory structure
        const id =
          pathParts.length > 0
            ? `${pathParts.join("/")}/${filename.replace(/\.tsx$/, "").replace(/\.preview$/, "")}`
            : filename.replace(/\.tsx$/, "").replace(/\.preview$/, "");

        const slug = filename.replace(/\.tsx$/, "").replace(/\.preview$/, "");

        // Store the path including directories in the component property
        store.set({
          id,
          data: {
            title: slug,
            component: relativePath,
          },
        });
      }

      // Get all JSON files in the previews directory
      const jsonFiles = import.meta.glob<{ default: Record<string, unknown> }>(
        "./previews/**/*.json",
        { eager: true },
      );

      // Process each JSON file
      for (const path in jsonFiles) {
        // Extract the path relative to ./previews
        const relativePath = path.replace("./previews/", "");
        // Get the directory structure
        const pathParts = relativePath.split("/");
        // The filename is the last part
        const filename = pathParts.pop() || "";
        // Create an ID that includes the directory structure
        // If the file is index.json, use only the directory name
        const id = filename === 'index.json'
          ? pathParts.join("/")
          : pathParts.length > 0
            ? `${pathParts.join("/")}/${filename.replace(/\.json$/, "")}`
            : filename.replace(/\.json$/, "");

        const slug = filename.replace(/\.json$/, "");
        const data = jsonFiles[path].default;

        // Store the JSON data, handling the directory flag and including the directory structure in the ID
        store.set({
          id,
          data: {
            title: slug,
            path: relativePath,
            ...data,
            directory: !!data.directory,
          },
        });
      }
    },
  };
}

const previews = defineCollection({
  schema: z
    .object({
      title: z.string(),
      component: z.string().optional(),
      directory: z.boolean().optional(),
    })
    .passthrough(),
  loader: reactComponentLoader(),
});

export const collections = { docs, previews };
