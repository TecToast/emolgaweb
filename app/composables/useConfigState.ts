export const useConfigState = defineStore("configState", () => {
  const { data: signupData, fetch: signupFetch } = useConfig(
    "/api/emolga/teststruct",
    "/api/emolga/testcontent"
  );
  return { signupData, signupFetch };
});

function useConfig(structPath: string, contentPath: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Ref<{ structure: ConfigValue; content: any } | undefined> =
    ref(undefined);
  async function fetch() {
    if (data.value !== undefined) {
      return;
    }
    const fetcher = useRequestFetch();
    const structure: ConfigValue = await fetcher(structPath);
    const content = await fetcher(contentPath);
    data.value = { structure, content };
  }
  return { data, fetch };
}
