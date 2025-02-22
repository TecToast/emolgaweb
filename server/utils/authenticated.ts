import type { EventHandler, EventHandlerRequest } from "h3";

export const defineEmolgaRoute = <D>(): EventHandler<EventHandlerRequest, D> =>
  defineEventHandler<EventHandlerRequest>(async (event) => {
    const { user } = await requireUserSession(event);
    const path = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    console.log("Path", path);
    const body = event.method === "GET" ? undefined : await readBody(event);
    const result = await $fetch(path, {
      headers: {
        "Content-Type": "application/json",
        UserID: user.id,
      },
      method: event.method,
      body,
    });
    console.log("Result", result);
    return result;
  });
