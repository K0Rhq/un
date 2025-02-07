import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  dts: true,
  format: ["esm"],
});
