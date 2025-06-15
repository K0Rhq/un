declare module "*.astro" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js";
  const component: AstroComponentFactory;
  export default component;
}

// Vite's import.meta.glob type definitions
interface ImportMetaGlobOptions {
  eager?: boolean;
  import?: string;
  query?: string;
  as?: string;
}

interface ImportMeta {
  // Standard lazy-loaded glob (returns functions)
  glob<T = unknown>(
    pattern: string,
    options?: Omit<ImportMetaGlobOptions, 'eager'>,
  ): Record<string, () => Promise<T>>;
  
  // Eager-loaded glob with direct module access
  glob<T = unknown>(
    pattern: string,
    options: ImportMetaGlobOptions & { eager: true },
  ): Record<string, T>;
  
  // URL import
  glob<T = string>(
    pattern: string,
    options: ImportMetaGlobOptions & { as: 'url' } | { query: '?url' },
  ): Record<string, T>;
  
  // Raw text import
  glob<T = string>(
    pattern: string,
    options: ImportMetaGlobOptions & { as: 'raw' } | { query: '?raw' },
  ): Record<string, T>;
  
  // Named import from module
  glob<T = unknown>(
    pattern: string, 
    options: ImportMetaGlobOptions & { import: string }
  ): Record<string, () => Promise<T>>;
  
  // Named import from module with eager loading
  glob<T = unknown>(
    pattern: string, 
    options: ImportMetaGlobOptions & { import: string; eager: true }
  ): Record<string, T>;
}