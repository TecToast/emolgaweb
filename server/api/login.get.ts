export default defineOAuthDiscordEventHandler({
  config: {},
  async onSuccess(event, { user }) {
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
