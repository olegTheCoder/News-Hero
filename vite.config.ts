import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/rss-proxy": {
        target: "https://api.allorigins.win",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss-proxy/, "/raw?url="),
      },
      "/sf-image": {
        target: "https://s3.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sf-image\//, ""),
      },
      "/bfl-image": {
        target: "https://delivery",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bfl-image/, ""),
      },
    },
  },
});