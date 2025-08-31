import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import type { UserConfig } from 'types/node'
import viteConfig from './vite.config'

export default defineConfig<UserConfig>({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
})
