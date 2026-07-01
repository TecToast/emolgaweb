export default defineEventHandler(async (event) => {
    const internalUrl = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    return fetchWithEvent(event, internalUrl, { redirect: "manual" });
})