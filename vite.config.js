import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    /*
     * Must be absolute, not "./" — with a client-side router and a
     * SPA rewrite (see vercel.json), a hard refresh on a nested route
     * like /employee/dashboard serves index.html at that URL; a
     * relative base would then resolve "./assets/x.js" against
     * /employee/ instead of the real asset root, 404ing every asset.
     */
    base: "/",

    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src")
      }
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_DEV_PORT || 5173),
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || "http://localhost:5000",
          changeOrigin: true
        }
      }
    },
    preview: {
      host: "0.0.0.0",
      port: Number(env.VITE_PREVIEW_PORT || 4173)
    }
  };
});
