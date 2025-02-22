export default defineOAuthDiscordEventHandler({
  config: {},
  async onSuccess(event, { user }) {
    const isAlphaTester = await $fetch<boolean>(
      `${useRuntimeConfig(event).emolgaBackendUrl}/api/emolga/validateuser`,
      {
        headers: {
          UserID: user.id,
        },
      }
    );
    if (!isAlphaTester) {
      await sendRedirect(event, "/alpha");
      return;
    }
    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.global_name,
        avatar: user.avatar,
      },
    });
    await sendRedirect(event, "/");
  },
});
