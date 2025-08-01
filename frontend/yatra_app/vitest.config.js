import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom', // important so `document` / DOM exists
    globals: true,        // optional: lets you use expect, etc. without importing
    setupFiles: [],       // can add a path here later if you need shared setup
  },
})
