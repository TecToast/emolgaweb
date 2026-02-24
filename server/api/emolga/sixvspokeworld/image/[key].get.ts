export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event);
    const key = getRouterParam(event, "key");
    if (!key) {
        throw createError({ statusCode: 400, statusMessage: "No key provided" });
    }
    const backendUrl = `${useRuntimeConfig(event).emolgaBackendUrl}/api/emolga/sixvspokeworld/image/${key}`;
    const result = await $fetch.raw(backendUrl, {
        responseType: "arrayBuffer",
        headers: {
            UserID: user.id,
        },
    });
    const contentType = result.headers.get("content-type") || "image/png";
    setResponseHeader(event, "Content-Type", contentType);
    setResponseHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
    return Buffer.from(result._data as ArrayBuffer);
});

