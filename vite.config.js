import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@components', replacement: '/src/components' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@routes', replacement: '/src/routes' },
      { find: '@hooks', replacement: '/src/hooks' },
    ],
  },
  css: {
    modules: {
      scopeBehaviour: 'local', // CSS Module을 local로 설정
    },
  },
});
