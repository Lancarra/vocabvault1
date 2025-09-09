import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5178,
    proxy: {
      "/users": {
        target: "https://localhost:7271",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
