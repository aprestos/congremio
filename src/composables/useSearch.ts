import { type Ref, ref } from "vue";

type SearchHandler = (query: string) => void | Promise<void>;

const searchQuery = ref("");
const searchHandler = ref<SearchHandler | null>(null);

export function useSearch() {
  const setSearchHandler = (handler: SearchHandler) => {
    searchHandler.value = handler;
  };

  const clearSearchHandler = () => {
    searchHandler.value = null;
    searchQuery.value = "";
  };

  const executeSearch = async (query: string) => {
    searchQuery.value = query;
    if (searchHandler.value) {
      await searchHandler.value(query);
    }
  };

  return {
    searchQuery: searchQuery as Readonly<Ref<string>>,
    setSearchHandler,
    clearSearchHandler,
    executeSearch,
  };
}
