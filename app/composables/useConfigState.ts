export const useConfigState = defineStore("configState", () => {
  const { data: signupData, fetch: signupFetch } = useConfig(
    "/api/emolga/teststruct",
    "/api/emolga/testcontent"
  );

  const defaultDataCache = ref<Record<string, any>>({});
  async function getDefaultData(path: string) {
    const currentValue = defaultDataCache.value[path];
    if (currentValue) {
      return currentValue;
    }
    const fetcher = useRequestFetch();
    const value = await fetcher("/api/emolga/defaultdata", { query: { path } });
    defaultDataCache.value[path] = value;
    return value;
  }
  return { signupData, signupFetch, getDefaultData };
});

function useConfig(structPath: string, contentPath: string) {
  const data: Ref<
    | { structure: ConfigValue; initialContent: any; modifiableContent: any }
    | undefined
  > = ref(undefined);
  async function fetch() {
    if (data.value !== undefined) {
      return;
    }
    const fetcher = useRequestFetch();
    const structure = await fetcher<ConfigValue>(structPath);
    const content = await fetcher(contentPath);
    data.value = {
      structure,
      initialContent: content,
      modifiableContent: JSON.parse(JSON.stringify(content)),
    };
  }
  return { data, fetch };
}
