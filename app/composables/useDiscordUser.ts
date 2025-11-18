export const useDiscordUser = defineStore("discordUser", () => {
  const usernameCache = ref<Record<string, { name: string; avatar: string }[]>>(
    {}
  );

  async function getUserDatas(leaguename: string) {
    if (usernameCache.value?.[leaguename]) {
      return usernameCache.value[leaguename];
    }
    const route = useRoute();
    const result = await useRequestFetch()<{ name: string; avatar: string }[]>(
      `/api/emolga/${route.params.guild}/league/${leaguename}/users`
    );
    usernameCache.value[leaguename] = result;
    return result;
  }

  return { getUserDatas };
});
