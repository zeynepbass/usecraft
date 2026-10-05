import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: ['react'],
    },
    minify: false,
  },
  test: {
    environment: 'jsdom',
  },
});
