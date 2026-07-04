export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith("/dashboard")) {
    const { loggedIn, fetchIfRequired } = useUserSession();
    await fetchIfRequired();
    if (!loggedIn.value) {
      return navigateTo("/");
    }
  }
  if(to.path.startsWith("/sixvspokeworld")) {
    const { user, fetchIfRequired } = useUserSession();
    await fetchIfRequired();
    try {
      await useRequestFetch()("/api/emolga/sixvspokeworld/authorized", {query: {user: user.value!.userId}})
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return navigateTo("/");
    }
  }
});
