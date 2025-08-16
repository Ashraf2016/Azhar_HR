import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import rollupNodePolyFill from "rollup-plugin-node-polyfills";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       buffer: "buffer", // 👈 هذا هو المهم
//     },
//   },
//   define: {
//     global: {}, // 👈 نُعرف global لإرضاء بعض مكتبات node
//   },
//   build: {
//     rollupOptions: {
//       plugins: [
//         rollupNodePolyFill(), // 👈 مهم لدعم Buffer و process في بعض المكتبات
//       ],
//     },
//   },
// });
