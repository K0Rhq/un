import { z } from "astro/zod";
import type { ComponentType } from "react";

// Custom loader for React (.tsx) files and JSON directory config files
export function reactComponentLoader(options?: { previewsDir?: string }) {
  // Default to src/previews if not specified
  const previewsDir = options?.previewsDir || "src/previews";
  const PreviewPropsSchema = z
    .object({
      title: z.string().optional(),
    })
    .passthrough();

  return async () => {
    const entries: Record<
      string,
      {
        title: string;
        component?: string;
        directory?: boolean;
        [key: string]: unknown;
      }
    > = {};
    // This function returns paths in the format we need for dynamic imports
    function getComponentId(path: string): string {
      return path.split("/").pop() || "";
    }

    // Get all preview components with eager loading to access exports directly
    // We need to use static glob patterns, so we'll handle different preview directories
    const tsxModulesAll = {
      // Handle various possible directory structures for the preview components
      ...import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("/src/previews/**/*.tsx", { eager: true }),
      ...import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("./src/previews/**/*.tsx", { eager: true }),
      ...import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("./previews/**/*.tsx", { eager: true }),
      ...import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("/previews/**/*.tsx", { eager: true }),
      ...import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("../previews/**/*.tsx", { eager: true }),
      ...import.meta.glob<{
        default: ComponentType<Record<string, never>>;
        PreviewProps?: Record<string, unknown>;
      }>("../../previews/**/*.tsx", { eager: true }),
    };

    // Filter for paths that match our previewsDir
    const tsxModules = Object.keys(tsxModulesAll)
      .filter(
        (path) =>
          path.includes(`/${previewsDir}/`) ||
          path.includes(`./${previewsDir}/`),
      )
      .reduce(
        (acc, path) => {
          acc[path] = tsxModulesAll[path];
          return acc;
        },
        {} as typeof tsxModulesAll,
      );

    // No need for separate paths, we can use the keys from tsxModules
    const tsxPaths = Object.keys(tsxModules);

    console.log(`[reactComponentLoader] Using previewsDir: ${previewsDir}`);
    console.log(
      `[reactComponentLoader] Found ${tsxPaths.length} TSX components`,
    );
    if (tsxPaths.length === 0) {
      console.warn(
        `[reactComponentLoader] No TSX files found. Make sure your previewsDir setting (${previewsDir}) is correct.`,
      );
      console.warn(
        "[reactComponentLoader] Searched in paths: /src/previews/, ./src/previews/, ./previews/, /previews/, ../previews/, ../../previews/",
      );
    }

    // Process each TSX component using our paths
    for (const path of tsxPaths) {
      // Extract the path relative to the previews directory by removing any prefix
      const relativePath = path.replace(
        new RegExp(`(^|.*?)(/${previewsDir}/|\\./${previewsDir}/)`, "i"),
        "",
      );
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
      // Ensure module and PreviewProps exist
      const rawPreviewProps =
        module && typeof module === "object" && module.PreviewProps
          ? module.PreviewProps
          : {};

      // Validate PreviewProps against schema
      const previewPropsResult = PreviewPropsSchema.safeParse(rawPreviewProps);

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
      entries[id] = {
        title: previewProps.title || slug,
        component: relativePath,
        ...previewProps,
      };

      console.log(
        `[reactComponentLoader] Added TSX entry: id=${id}, component=${relativePath}`,
      );
    }

    // Get all JSON files in the previews directory, using static patterns
    const jsonFilesAll = {
      ...import.meta.glob<{ default: Record<string, unknown> }>(
        "/src/previews/**/*.json",
        { eager: true },
      ),
      ...import.meta.glob<{ default: Record<string, unknown> }>(
        "./src/previews/**/*.json",
        { eager: true },
      ),
      ...import.meta.glob<{ default: Record<string, unknown> }>(
        "./previews/**/*.json",
        { eager: true },
      ),
      ...import.meta.glob<{ default: Record<string, unknown> }>(
        "/previews/**/*.json",
        { eager: true },
      ),
      ...import.meta.glob<{ default: Record<string, unknown> }>(
        "../previews/**/*.json",
        { eager: true },
      ),
      ...import.meta.glob<{ default: Record<string, unknown> }>(
        "../../previews/**/*.json",
        { eager: true },
      ),
    };

    // Filter for paths that match our previewsDir
    const jsonFiles = Object.keys(jsonFilesAll)
      .filter(
        (path) =>
          path.includes(`/${previewsDir}/`) ||
          path.includes(`./${previewsDir}/`),
      )
      .reduce(
        (acc, path) => {
          acc[path] = jsonFilesAll[path];
          return acc;
        },
        {} as typeof jsonFilesAll,
      );

    // Convert the keys to an array for safer iteration
    const jsonPaths = Object.keys(jsonFiles);

    console.log(`[reactComponentLoader] Found ${jsonPaths.length} JSON files`);

    // Process each JSON file using our paths array
    for (const path of jsonPaths) {
      // Extract the path relative to the previews directory by removing any prefix
      const relativePath = path.replace(
        new RegExp(`(^|.*?)(/${previewsDir}/|\\./${previewsDir}/)`, "i"),
        "",
      );
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
      entries[id] = {
        title: slug,
        component: relativePath, // Ensure component property is set for JSON files too
        path: relativePath,
        ...data,
        directory: !!data.directory,
      };

      console.log(
        `[reactComponentLoader] Added JSON entry: id=${id}, directory=${!!data.directory}, component=${relativePath}`,
      );
    }

    console.log(
      `[reactComponentLoader] Returning ${Object.keys(entries).length} total entries`,
    );

    // Debug sample entry to check structure
    if (Object.keys(entries).length > 0) {
      const sampleEntryId = Object.keys(entries)[0];
      const sampleEntry = entries[sampleEntryId];
      console.log("[reactComponentLoader] Sample entry structure:", {
        id: sampleEntryId,
        dataKeys: Object.keys(sampleEntry),
        component: sampleEntry.component,
        hasComponent: "component" in sampleEntry,
        dataType: typeof sampleEntry,
        entriesType: typeof entries,
      });
    }

    // Transform entries to match Astro content collection expected format
    // Instead of returning { id: { ...data } }, return { id: data }
    // This prevents Astro from nesting our data under a "data" property
    const result: Record<string, unknown> = {};

    for (const [id, entryData] of Object.entries(entries)) {
      result[id] = entryData;
    }

    return result;
  };
}
