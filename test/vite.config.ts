import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: '.',
  server: {
    port: 8001,
    host: true,
    open: '/test-browser.html',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: '../dist-test',
    emptyOutDir: true,
    rollupOptions: {
      input: 'test-browser.html',
    },
  },
});
