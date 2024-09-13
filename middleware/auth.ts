export default defineNuxtRouteMiddleware(async (to, from) => {
    const discord = useDiscordStore();
    if (discord.shouldRequestUser()) {
        console.log("loading user...")
        await discord.loadUser();
        console.log(discord.user)
    }
    const {user} = storeToRefs(discord)

    console.log(user.value)
    if (!user.value) {
        return navigateTo('/')
    }
})
