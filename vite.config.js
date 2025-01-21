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
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
  optimizeDeps: {
    include: [
      "quill",
      "react-quilljs",
      "sweetalert2",
      "sweetalert2-react-content",
    ],
  },
  css: {
    modules: {
      scopeBehaviour: "local",
    },
  },
});
