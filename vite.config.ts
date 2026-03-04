import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      overlay: false, // Menghilangkan overlay merah jika ada error
    },
  },
  publicDir: "public",
});
