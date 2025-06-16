import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      stylus: {
        // imports: [path.resolve('./src/assets/styles/_globals.styl')]
        additionalData: `@import "${path.resolve(__dirname, './src/assets/styles/_globals.styl')}"`
      },
    },
  },
})
