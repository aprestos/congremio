/// <reference types="vite/client" />

// Declare .vue files so TypeScript and IDEs (JetBrains) properly recognize SFC modules
// and provide auto-completion / auto-import support.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >

  export default component
}
