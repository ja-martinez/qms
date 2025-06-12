import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import {VitePWA} from "vite-plugin-pwa"

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), VitePWA({
    includeAssets: ["qms-icon-192.png", "qms-icon-512.png"],
    manifest: {
      name: "Queue Management System",
      short_name: "QMS",
      description: "Queue Management System for RL JONES INSURANCE",
      theme_color: "#ffffff",
      start_url: "/kiosk?standalone=true",
      display: "standalone",
      icons: [
        {
          src: "qms-icon-192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "qms-icon-512.png",
          sizes: "512x152",
          type: "image/png"
        }
      ]
    }
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
