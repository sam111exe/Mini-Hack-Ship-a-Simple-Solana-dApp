import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
  },
  server: {
    host: "mbp.sergazin.kz",
    https: {
      cert: "/Users/a1/secrets/ssl/letsencrypt/mbp.sergazin.kz/cert.pem",
      key: "/Users/a1/secrets/ssl/letsencrypt/mbp.sergazin.kz/privkey.pem",
    },
    allowedHosts: ["mbp.sergazin.kz"],
    proxy: {
      "/api": {
        changeOrigin: true,
        target: "http://0.0.0.0:3028",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
