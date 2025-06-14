import { defineCollection } from "astro:content";
import { DocsSchema } from "@korhq/undocs";
import { glob } from "astro/loaders";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";
import type { ComponentType } from "react";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/docs" }),
  schema: DocsSchema,
});

const PreviewPropsSchema = z
  .object({
    title: z.string().optional(),
  })
  .passthrough();

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
        query: "?url",
        import: "default",
      });

      // Also get the modules to extract the PreviewProps
      const tsxModules = import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("./previews/**/*.tsx", {
        eager: true,
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

        // Get PreviewProps from the module if available
        const module = tsxModules[path];
        const rawPreviewProps = module?.PreviewProps || {};

        // Validate PreviewProps against schema
        const previewPropsResult =
          PreviewPropsSchema.safeParse(rawPreviewProps);

        if (!previewPropsResult.success) {
          console.error(
            `Invalid PreviewProps in ${path}:`,
            previewPropsResult.error,
          );
        }

        // Use validated props or empty object
        const previewProps = previewPropsResult.success
          ? previewPropsResult.data
          : {};

        // Store the path including directories in the component property
        // Use PreviewProps.title if available, otherwise use slug
        store.set({
          id,
          data: {
            title: previewProps.title || slug,
            component: relativePath,
            ...previewProps,
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
        const id =
          filename === "index.json"
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
