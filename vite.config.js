import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
    })
  ],
  root: path.join(__dirname, 'src/renderer'),
  base: './',
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, 'src/renderer/index.html'),
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: true,
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/renderer'),
    },
  },
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase',
    },
  },
  clearScreen: false,
  logLevel: 'info',
}) 