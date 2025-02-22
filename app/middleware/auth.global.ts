export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith("/dashboard")) {
    const { loggedIn } = useUserSession();
    if (!loggedIn.value) {
      return navigateTo("/");
    }
  }
});
