export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event);
    const formData = await readFormData(event);
    const file = formData.get("file") as File | null;
    if (!file) {
        throw createError({ statusCode: 400, statusMessage: "No file provided" });
    }
    const backendUrl = `${useRuntimeConfig(event).emolgaBackendUrl}/api/emolga/sixvspokeworld/image`;
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    return await $fetch<{ key: string }>(backendUrl, {
        method: "POST",
        headers: {
            UserID: user.id,
        },
        body: backendFormData,
    });
});

