import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for static assets during build
  server: {
    port: 3000, // Serve frontend on port 3000 to keep it standard
    open: true  // Open browser on launch
  }
});

