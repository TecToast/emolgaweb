export default defineEventHandler(async (event) => {
    const internalUrl = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    const method = event.method
    return fetchWithEvent(event, internalUrl, { redirect: "manual", method, body: method != 'GET' ? (await readRawBody(event)) : undefined });
})