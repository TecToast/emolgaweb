import type { SelectMenuItem } from "#ui/types";
type ItemWithID = SelectMenuItem & { id?: string };

export default async function (guild: string, shouldFetch: boolean) {
  if (!shouldFetch) {
    return ref([]);
  }
  const configState = useChannelCache();

  await callOnce("channelFetch" + guild, async () => {
    await configState.getChannels(guild as string);
  });

  const channelOptions: Ref<ItemWithID[]> = computed(() => {
    const cache = configState.channelCache.value[guild as string];
    if (!cache) return [];
    const entries: ItemWithID[] = Object.entries(cache).flatMap(
      ([key, value]) => {
        return [
          { type: "label", label: key },
          ...Object.entries(value).map(([id, name]) => ({
            id: id,
            label: "#" + name,
          })),
          { type: "separator" },
        ];
      }
    );
    return entries;
  });

  return channelOptions;
}

function _useChannelCache() {
  const channelCache = ref<
    Record<string, Record<string, Record<string, string>>>
  >({});
  async function getChannels(guildId: string) {
    const existing = channelCache.value[guildId];
    if (existing) {
      return existing;
    }
    const fetched = await useRequestFetch()(`/api/emolga/${guildId}/channels`);
    channelCache.value[guildId] = fetched;
    return fetched;
  }

  return { channelCache, getChannels };
}

const useChannelCache = createSharedComposable(_useChannelCache);
