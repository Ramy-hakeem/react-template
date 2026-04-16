import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    // mkcert(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7260',
        changeOrigin: true,
        secure: false, // Accept self-signed certs from backend
        cookieDomainRewrite: 'localhost',
      },
    },
  },
});
