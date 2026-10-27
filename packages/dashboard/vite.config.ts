import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind IPv4 so both localhost and 127.0.0.1 work (Vite default can be IPv6-only).
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
