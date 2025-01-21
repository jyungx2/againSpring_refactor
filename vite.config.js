import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@components", replacement: "/src/components" },
      { find: "@pages", replacement: "/src/pages" },
      { find: "@routes", replacement: "/src/routes" },
      { find: "@hooks", replacement: "/src/hooks" },
      { find: "@store", replacement: "/src/store" },
      { find: "@constants", replacement: "/src/constants" },
      { find: "@utils", replacement: "/src/utils" },
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // 번들에 포함시킬 모듈의 경로
      extensions: [".js", ".cjs"], // CommonJS 모듈로 간주할 파일의 확장자
      strictRequires: true, // require 구문에 해당 모듈이 없을 경우 에러 발생
      transformMixedEsModules: true, // import와 require문을 함께 사용하는 경우 이를 번들에 포함시키기 위함
    },
  },
  css: {
    modules: {
      scopeBehaviour: "local",
    },
  },
});
