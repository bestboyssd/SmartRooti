import { defineConfig } from "vite";

const pagesBase = process.env.GITHUB_ACTIONS === "true" ? "/SmartRooti/" : "/";

export default defineConfig({
  base: pagesBase,
  build: {
    cssMinify: false,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
