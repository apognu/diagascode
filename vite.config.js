import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib.ts"),
      name: "@apognu/diagascode",
      fileName: (format) => `diagascode.${format}.js`,
    },
    src: "./src",
    outDir: "./dist",
  },
  plugins: [],
});
