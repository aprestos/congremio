import { type Ref, ref } from 'vue'

type SearchHandler = (query: string) => void | Promise<void>

const searchQuery = ref('')
const searchHandler = ref<SearchHandler | null>(null)

export function useSearch(): {
  searchQuery: Readonly<Ref<string>>
  setSearchHandler: (handler: SearchHandler) => void
  clearSearchHandler: () => void
  executeSearch: (query: string) => Promise<void>
} {
  const setSearchHandler = (handler: SearchHandler): void => {
    searchHandler.value = handler
  }

  const clearSearchHandler = (): void => {
    searchHandler.value = null
    searchQuery.value = ''
  }

  const executeSearch = async (query: string): Promise<void> => {
    searchQuery.value = query
    if (searchHandler.value) {
      await searchHandler.value(query)
    }
  }

  return {
    searchQuery: searchQuery as Readonly<Ref<string>>,
    setSearchHandler,
    clearSearchHandler,
    executeSearch,
  }
}
