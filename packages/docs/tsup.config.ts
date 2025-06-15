import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/variants.ts"],
  outDir: "dist",
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  dts: true,
  format: ["esm"],
  target: "es2022",
  external: ["astro", "react", "react-dom", "zustand"],
});
