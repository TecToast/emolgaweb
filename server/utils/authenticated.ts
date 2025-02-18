import type { EventHandler, EventHandlerRequest } from "h3";

export const defineEmolgaRoute = <D>(): EventHandler<EventHandlerRequest, D> =>
  defineEventHandler<EventHandlerRequest>(async (event) => {
    const { user } = await requireUserSession(event);
    const path = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    console.log("Path", path);
    const result = await $fetch(path, {
      headers: {
        UserID: user.id,
      },
    });
    console.log("Result", result);
    return result;
  });
