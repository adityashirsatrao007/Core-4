import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

/**
 * bypass: called for every request matching the proxy rule.
 * - If the browser is navigating to a page (Accept: text/html), return "/index.html"
 *   so React Router handles the route client-side on reload.
 * - Otherwise (Axios/fetch API call), return undefined to let the proxy forward it.
 */
function spaBypass(req) {
  if (req.headers["accept"]?.includes("text/html")) {
    return "/index.html";
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // ── Auth API routes (backend only) ─────────────────────────────────────
      // ⚠️  /auth/callback is a FRONTEND route handled by React Router — NOT proxied.
      "/auth/me":     { target: "http://localhost:8000", changeOrigin: true },
      "/auth/login":  { target: "http://localhost:8000", changeOrigin: true },
      "/auth/signup": { target: "http://localhost:8000", changeOrigin: true },
      "/auth/google": { target: "http://localhost:8000", changeOrigin: true },

      // ── Data API routes ────────────────────────────────────────────────────
      // bypass() ensures browser page-reloads on /orgs/... or /projects/...
      // return index.html (SPA), while Axios API calls still reach the backend.
      "/orgs": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: spaBypass,
      },
      "/projects": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: spaBypass,
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
