import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { resolve as resolvePath, resolve } from 'path'

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: [
      {
        find: '~core',
        replacement: resolve(__dirname, '../../packages/~core'),
      },
      {
        find: '~api',
        replacement: resolve(__dirname, '../../packages/~api'),
      },
      {
        find: '~ui',
        replacement: resolvePath(__dirname, '../../packages/~ui'),
      },
    ],
  },

  // FIXME: I have to do this because of the way Bun handles file watching on M1.
  // This is a workaround to avoid the issue.
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
