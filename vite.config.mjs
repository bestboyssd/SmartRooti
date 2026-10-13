import { defineConfig } from "vite";

const pagesBase = process.env.GITHUB_ACTIONS === "true" ? "/SmartRooti/" : "/";

export default defineConfig({
  base: pagesBase,
  build: {
    cssMinify: true,
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  preview: {
    host: "127.0.0.1",
    port: 3000,
  },
});
