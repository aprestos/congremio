import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // ✅ Vue + TS recommended baseline
  vueTsConfigs.recommended,

  // ✅ Strict TypeScript rules
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json', // enable type-aware rules
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // Type-aware rules
      ...tseslint.configs['recommended-requiring-type-checking'].rules,

      // Strictness
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Member ordering
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
          ],
        },
      ],
    },
  },

  // ✅ Strict Vue rules
  {
    files: ['**/*.vue'],
    rules: {
      ...pluginVue.configs['flat/recommended'].rules,

      // Props & Emits strictness
      'vue/require-typed-ref': 'error',
      'vue/require-prop-types': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-emit-validator': 'error',

      // No unused Vue features
      'vue/no-unused-properties': [
        'error',
        {
          groups: ['props', 'data', 'computed', 'methods', 'setup'],
          ignorePublicMembers: false,
        },
      ],
      'vue/no-unused-components': 'error',
      'vue/no-unused-vars': 'error',

      // Enforce consistency
      'vue/require-explicit-emits': 'error',
      'vue/require-expose': 'error',
      'vue/require-valid-default-prop': 'error',
      'vue/no-deprecated-slot-attribute': 'error',
    },
  },

  // ✅ Vitest config
  {
    ...pluginVitest.configs.recommended,
    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  // ✅ Playwright config
  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  // ✅ Prettier (disable formatting rules in ESLint)
  skipFormatting,
)
