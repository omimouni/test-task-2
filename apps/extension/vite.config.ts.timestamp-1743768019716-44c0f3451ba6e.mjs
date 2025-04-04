// vite.config.ts
import { resolve as resolvePath } from "path";
import { defineConfig } from "file:///Users/omimouni/Desktop/test-task-2/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///Users/omimouni/Desktop/test-task-2/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import tsconfigPaths from "file:///Users/omimouni/Desktop/test-task-2/node_modules/vite-tsconfig-paths/dist/index.mjs";

// config/compile-manifest.ts
import { readFile, writeFile } from "fs/promises";
var compileManifest = async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const manifestBase = JSON.parse(
    await readFile("src/manifest-base.json", "utf8")
  );
  manifestBase.version = packageJson.version;
  await writeFile("dist/manifest.json", JSON.stringify(manifestBase, null, 2));
};

// config/copy-assets.ts
import fs from "file:///Users/omimouni/Desktop/test-task-2/node_modules/fs-extra/lib/index.js";
var copyAssets = () => {
  fs.copySync("icons", "dist/icons");
};

// config/preprocess-fonts.ts
var preprocessFonts = () => {
  return {
    name: "font-url-transform",
    generateBundle(_options, bundle) {
      for (const fileName in bundle) {
        if (!fileName.includes("content-scripts/main.js"))
          continue;
        const file = bundle[fileName];
        if (file.type === "asset") {
          const content = file.source.toString();
          file.source = content.replaceAll(
            /\/fonts\/uprent-(.+?\.woff2?)/g,
            "chrome-extension://nnjokgfpoecefilcbmcinacgmefmdabl/fonts/uprent-$1"
          );
        } else {
          const content = file.code;
          file.code = content.replaceAll(
            /\/fonts\/uprent-(.+?\.woff2?)/g,
            "chrome-extension://nnjokgfpoecefilcbmcinacgmefmdabl/fonts/uprent-$1"
          );
        }
      }
    }
  };
};

// vite.config.ts
var __vite_injected_original_dirname = "/Users/omimouni/Desktop/test-task-2/apps/extension";
var resolve = {
  alias: [
    {
      find: "~api",
      replacement: resolvePath(__vite_injected_original_dirname, "../../packages/~api")
    },
    {
      find: "~core",
      replacement: resolvePath(__vite_injected_original_dirname, "../../packages/~core")
    },
    {
      find: "~ui",
      replacement: resolvePath(__vite_injected_original_dirname, "../../packages/~ui")
    }
  ]
};
var vite_config_default = defineConfig(({ mode }) => {
  if (mode === "service-worker") {
    return {
      plugins: [tsconfigPaths()],
      build: {
        sourcemap: true,
        emptyOutDir: false,
        rollupOptions: {
          input: {
            "service-worker/background": "/src/_service-worker/background.ts"
          },
          output: {
            format: "iife",
            entryFileNames: "[name].js"
          }
        }
      },
      resolve
    };
  }
  return {
    plugins: [
      tsconfigPaths({
        ignoreConfigErrors: true
      }),
      preprocessFonts(),
      svelte(),
      {
        name: "post-build-hooks",
        async buildEnd() {
          await compileManifest();
          copyAssets();
        }
      }
    ],
    build: {
      chunkSizeWarningLimit: 1200,
      emptyOutDir: false,
      sourcemap: true,
      minify: mode === "prod" ? "esbuild" : false,
      rollupOptions: {
        input: {
          "content-scripts/main": "/src/_content-scripts/main.ts"
        },
        output: {
          format: "iife",
          entryFileNames: "[name].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.names?.[0]?.includes(".woff")) {
              return "fonts/uprent-[name][extname]";
            } else {
              return "assets/[name]-[hash][extname]";
            }
          }
        }
      }
    },
    resolve
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnL2NvbXBpbGUtbWFuaWZlc3QudHMiLCAiY29uZmlnL2NvcHktYXNzZXRzLnRzIiwgImNvbmZpZy9wcmVwcm9jZXNzLWZvbnRzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL29taW1vdW5pL0Rlc2t0b3AvdGVzdC10YXNrLTIvYXBwcy9leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9vbWltb3VuaS9EZXNrdG9wL3Rlc3QtdGFzay0yL2FwcHMvZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9vbWltb3VuaS9EZXNrdG9wL3Rlc3QtdGFzay0yL2FwcHMvZXh0ZW5zaW9uL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSBhcyByZXNvbHZlUGF0aCB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBzdmVsdGUgfSBmcm9tICdAc3ZlbHRlanMvdml0ZS1wbHVnaW4tc3ZlbHRlJ1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbmltcG9ydCB7IGNvbXBpbGVNYW5pZmVzdCB9IGZyb20gJy4vY29uZmlnL2NvbXBpbGUtbWFuaWZlc3QnXG5pbXBvcnQgeyBjb3B5QXNzZXRzIH0gZnJvbSAnLi9jb25maWcvY29weS1hc3NldHMnXG5pbXBvcnQgeyBwcmVwcm9jZXNzRm9udHMgfSBmcm9tICcuL2NvbmZpZy9wcmVwcm9jZXNzLWZvbnRzJ1xuXG5jb25zdCByZXNvbHZlID0ge1xuICBhbGlhczogW1xuICAgIHtcbiAgICAgIGZpbmQ6ICd+YXBpJyxcbiAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlUGF0aChfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9+YXBpJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBmaW5kOiAnfmNvcmUnLFxuICAgICAgcmVwbGFjZW1lbnQ6IHJlc29sdmVQYXRoKF9fZGlybmFtZSwgJy4uLy4uL3BhY2thZ2VzL35jb3JlJyksXG4gICAgfSxcbiAgICB7XG4gICAgICBmaW5kOiAnfnVpJyxcbiAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlUGF0aChfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9+dWknKSxcbiAgICB9LFxuICBdLFxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KTogVXNlckNvbmZpZyA9PiB7XG4gIGlmIChtb2RlID09PSAnc2VydmljZS13b3JrZXInKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBsdWdpbnM6IFt0c2NvbmZpZ1BhdGhzKCldLFxuICAgICAgYnVpbGQ6IHtcbiAgICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgJ3NlcnZpY2Utd29ya2VyL2JhY2tncm91bmQnOiAnL3NyYy9fc2VydmljZS13b3JrZXIvYmFja2dyb3VuZC50cycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdbbmFtZV0uanMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcmVzb2x2ZSxcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHRzY29uZmlnUGF0aHMoe1xuICAgICAgICBpZ25vcmVDb25maWdFcnJvcnM6IHRydWUsXG4gICAgICB9KSxcbiAgICAgIHByZXByb2Nlc3NGb250cygpLFxuICAgICAgc3ZlbHRlKCksXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdwb3N0LWJ1aWxkLWhvb2tzJyxcbiAgICAgICAgYXN5bmMgYnVpbGRFbmQoKSB7XG4gICAgICAgICAgYXdhaXQgY29tcGlsZU1hbmlmZXN0KClcbiAgICAgICAgICBjb3B5QXNzZXRzKClcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMjAwLFxuICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgbWluaWZ5OiBtb2RlID09PSAncHJvZCcgPyAnZXNidWlsZCcgOiBmYWxzZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgICAnY29udGVudC1zY3JpcHRzL21haW4nOiAnL3NyYy9fY29udGVudC1zY3JpcHRzL21haW4udHMnLFxuICAgICAgICB9LFxuXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogYXNzZXRJbmZvID0+IHtcbiAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZXM/LlswXT8uaW5jbHVkZXMoJy53b2ZmJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdmb250cy91cHJlbnQtW25hbWVdW2V4dG5hbWVdJ1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmUsXG4gIH1cbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9vbWltb3VuaS9EZXNrdG9wL3Rlc3QtdGFzay0yL2FwcHMvZXh0ZW5zaW9uL2NvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL29taW1vdW5pL0Rlc2t0b3AvdGVzdC10YXNrLTIvYXBwcy9leHRlbnNpb24vY29uZmlnL2NvbXBpbGUtbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL29taW1vdW5pL0Rlc2t0b3AvdGVzdC10YXNrLTIvYXBwcy9leHRlbnNpb24vY29uZmlnL2NvbXBpbGUtbWFuaWZlc3QudHNcIjtpbXBvcnQgeyByZWFkRmlsZSwgd3JpdGVGaWxlIH0gZnJvbSAnZnMvcHJvbWlzZXMnXG5cbmV4cG9ydCBjb25zdCBjb21waWxlTWFuaWZlc3QgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShhd2FpdCByZWFkRmlsZSgncGFja2FnZS5qc29uJywgJ3V0ZjgnKSlcblxuICBjb25zdCBtYW5pZmVzdEJhc2UgPSBKU09OLnBhcnNlKFxuICAgIGF3YWl0IHJlYWRGaWxlKCdzcmMvbWFuaWZlc3QtYmFzZS5qc29uJywgJ3V0ZjgnKSxcbiAgKVxuXG4gIG1hbmlmZXN0QmFzZS52ZXJzaW9uID0gcGFja2FnZUpzb24udmVyc2lvblxuICBhd2FpdCB3cml0ZUZpbGUoJ2Rpc3QvbWFuaWZlc3QuanNvbicsIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0QmFzZSwgbnVsbCwgMikpXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9vbWltb3VuaS9EZXNrdG9wL3Rlc3QtdGFzay0yL2FwcHMvZXh0ZW5zaW9uL2NvbmZpZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL29taW1vdW5pL0Rlc2t0b3AvdGVzdC10YXNrLTIvYXBwcy9leHRlbnNpb24vY29uZmlnL2NvcHktYXNzZXRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9vbWltb3VuaS9EZXNrdG9wL3Rlc3QtdGFzay0yL2FwcHMvZXh0ZW5zaW9uL2NvbmZpZy9jb3B5LWFzc2V0cy50c1wiO2ltcG9ydCBmcyBmcm9tICdmcy1leHRyYSdcblxuZXhwb3J0IGNvbnN0IGNvcHlBc3NldHMgPSAoKSA9PiB7XG4gIGZzLmNvcHlTeW5jKCdpY29ucycsICdkaXN0L2ljb25zJylcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL29taW1vdW5pL0Rlc2t0b3AvdGVzdC10YXNrLTIvYXBwcy9leHRlbnNpb24vY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvb21pbW91bmkvRGVza3RvcC90ZXN0LXRhc2stMi9hcHBzL2V4dGVuc2lvbi9jb25maWcvcHJlcHJvY2Vzcy1mb250cy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvb21pbW91bmkvRGVza3RvcC90ZXN0LXRhc2stMi9hcHBzL2V4dGVuc2lvbi9jb25maWcvcHJlcHJvY2Vzcy1mb250cy50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSdcblxuZXhwb3J0IGNvbnN0IHByZXByb2Nlc3NGb250cyA9ICgpOiBQbHVnaW4gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdmb250LXVybC10cmFuc2Zvcm0nLFxuICAgIGdlbmVyYXRlQnVuZGxlKF9vcHRpb25zLCBidW5kbGUpIHtcbiAgICAgIGZvciAoY29uc3QgZmlsZU5hbWUgaW4gYnVuZGxlKSB7XG4gICAgICAgIGlmICghZmlsZU5hbWUuaW5jbHVkZXMoJ2NvbnRlbnQtc2NyaXB0cy9tYWluLmpzJykpIGNvbnRpbnVlXG5cbiAgICAgICAgY29uc3QgZmlsZSA9IGJ1bmRsZVtmaWxlTmFtZV1cbiAgICAgICAgaWYgKGZpbGUudHlwZSA9PT0gJ2Fzc2V0Jykge1xuICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBmaWxlLnNvdXJjZS50b1N0cmluZygpXG5cbiAgICAgICAgICBmaWxlLnNvdXJjZSA9IGNvbnRlbnQucmVwbGFjZUFsbChcbiAgICAgICAgICAgIC9cXC9mb250c1xcL3VwcmVudC0oLis/XFwud29mZjI/KS9nLFxuICAgICAgICAgICAgJ2Nocm9tZS1leHRlbnNpb246Ly9ubmpva2dmcG9lY2VmaWxjYm1jaW5hY2dtZWZtZGFibC9mb250cy91cHJlbnQtJDEnLFxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjb250ZW50ID0gZmlsZS5jb2RlXG4gICAgICAgICAgZmlsZS5jb2RlID0gY29udGVudC5yZXBsYWNlQWxsKFxuICAgICAgICAgICAgL1xcL2ZvbnRzXFwvdXByZW50LSguKz9cXC53b2ZmMj8pL2csXG4gICAgICAgICAgICAnY2hyb21lLWV4dGVuc2lvbjovL25uam9rZ2Zwb2VjZWZpbGNibWNpbmFjZ21lZm1kYWJsL2ZvbnRzL3VwcmVudC0kMScsXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxTQUFTLFdBQVcsbUJBQW1CO0FBQy9XLFNBQVMsb0JBQXFDO0FBQzlDLFNBQVMsY0FBYztBQUN2QixPQUFPLG1CQUFtQjs7O0FDSDZVLFNBQVMsVUFBVSxpQkFBaUI7QUFFcFksSUFBTSxrQkFBa0IsWUFBWTtBQUN6QyxRQUFNLGNBQWMsS0FBSyxNQUFNLE1BQU0sU0FBUyxnQkFBZ0IsTUFBTSxDQUFDO0FBRXJF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
