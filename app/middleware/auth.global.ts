export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith("/dashboard")) {
    const { loggedIn } = useUserSession();
    if (!loggedIn.value) {
      return navigateTo("/");
    }
  }
  if(to.path.startsWith("/sixvspokeworld")) {
    const { user } = useUserSession();
    try {
      await useRequestFetch()("/api/emolga/sixvspokeworld/authorized", {query: {user: user.value!.id}})
    } catch (e) {
        return navigateTo("/");
    }
  }
});
