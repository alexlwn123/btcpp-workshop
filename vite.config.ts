import path from "path";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: {
    format: "es",
    plugins: () => [wasm()],
  },

  optimizeDeps: {
    exclude: ["@fedimint/core-web"],
  },
});
