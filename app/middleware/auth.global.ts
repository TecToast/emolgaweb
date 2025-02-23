export default defineNuxtRouteMiddleware((to) => {
  if (to.path.startsWith("/dashboard")) {
    const { loggedIn } = useUserSession();
    if (!loggedIn.value) {
      return navigateTo("/");
    }
  }
});
