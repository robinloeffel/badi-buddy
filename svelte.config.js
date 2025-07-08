import vercel from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: vercel(),
    alias: {
      $components: "./src/lib/components/index.ts",
      $styles: "./src/lib/styles",
      $img: "./src/lib/img",
      $utils: "./src/lib/utils/index.ts",
      $generated: "./src/lib/generated"
    }
  }
};
