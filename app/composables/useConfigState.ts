export const useConfigState = defineStore("configState", () => {
  const configCache = ref<
    Record<
      string,
      { data: Ref<FullConfigData | undefined>; fetch: () => Promise<void> }
    >
  >({});

  function getConfig(path: string) {
    if (configCache.value?.[path]) {
      return configCache.value[path];
    }
    const result = useConfig(path);
    configCache.value[path] = result;
    return result;
  }

  const defaultDataCache = ref<Record<string, any>>({});
  async function getDefaultData(path: string) {
    const currentValue = defaultDataCache.value[path];
    if (currentValue) {
      return JSON.parse(JSON.stringify(currentValue));
    }
    const fetcher = useRequestFetch();
    const value = await fetcher("/api/emolga/defaultdata", { query: { path } });
    defaultDataCache.value[path] = value;
    return value;
  }
  return { getConfig, getDefaultData, defaultDataCache };
});

function useConfig(path: string) {
  const structPath = path + "/struct";
  const contentPath = path + "/content";
  const savePath = path + "/save";
  const data: Ref<FullConfigData | undefined> = ref(undefined);
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
      changedPaths: new Set<string>(),
      savePath,
    };
  }
  return { data, fetch };
}

export type FullConfigData = {
  structure: ConfigValue;
  initialContent: any;
  modifiableContent: any;
  changedPaths: Set<string>;
  savePath: string;
};
