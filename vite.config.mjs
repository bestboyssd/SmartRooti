import { defineConfig } from "vite";

export default defineConfig({
  base: "/SmartRooti/",
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
