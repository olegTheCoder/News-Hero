import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/News-Hero/",
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
      "/hf-api": {
        target: "https://api-inference.huggingface.co",
        changeOrigin: true,
      },
      "/gen-api": {
        target: "https://api.gen-api.ru",
        changeOrigin: true,
      },
    },
  },
});