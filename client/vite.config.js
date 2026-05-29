import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 가로챕니다.
      '/api': {
        target: 'http://127.0.0.1:8000', // localhost 대신 127.0.0.1 시도 (간혹 호스트 문제 발생)
        changeOrigin: true,
        secure: false, // 보안 연결이 아니어도 허용
        // rewrite를 지우면 프론트의 /api/v1/...가 백엔드의 /api/v1/...로 그대로 전달됩니다.
      },
    },
  },
})
