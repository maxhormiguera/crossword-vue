import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    svgLoader()
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
