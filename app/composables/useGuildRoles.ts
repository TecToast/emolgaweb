import type { SelectMenuItem } from "#ui/types";
type ItemWithID = SelectMenuItem & { id?: string };

export default async function (guild: string, shouldFetch: boolean) {
  if (!shouldFetch) {
    return ref([]);
  }
  const roleCache = useRoleCache();

  await callOnce("roleFetch" + guild, async () => {
    await roleCache.getRoles(guild as string);
  });

  const roleOptions: Ref<ItemWithID[]> = computed(() => {
    const cache = roleCache.roleCache.value[guild as string];
    if (!cache) return [];
    const entries: ItemWithID[] = Object.entries(cache).map(([key, value]) => {
      return {
        label: value,
        id: key,
        disabled: key[0] === "-",
      };
    });
    return entries;
  });

  return roleOptions;
}

function _useRoleCache() {
  const roleCache = ref<Record<string, Record<string, string>>>({});
  async function getRoles(guildId: string) {
    const existing = roleCache.value[guildId];
    if (existing) {
      return existing;
    }
    const fetched = await useRequestFetch()(`/api/emolga/${guildId}/roles`);
    roleCache.value[guildId] = fetched;
    return fetched;
  }

  return { roleCache, getRoles };
}

const useRoleCache = createSharedComposable(_useRoleCache);
