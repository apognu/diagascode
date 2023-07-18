import path from "path";
import { defineConfig } from "vite";
import ViteYaml from "@modyfi/vite-plugin-yaml";

export default defineConfig({
  plugins: [ViteYaml()],
});
