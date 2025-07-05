import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.js"],
  format: ["cjs"],
  dts: false,
});
