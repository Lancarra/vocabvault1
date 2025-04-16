import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5178,
    proxy: {
      "/api": {
        target: "http://localhost:5267",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
