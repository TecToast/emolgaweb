import type { EventHandler, EventHandlerRequest } from "h3";
import type { ConfigValue } from "~/utils/types";

export const defineEmolgaRoute = <D>(): EventHandler<EventHandlerRequest, D> =>
  defineEventHandler<EventHandlerRequest>(async (event) => {
    const { user } = await requireUserSession(event);
    const path = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    const body = event.method === "GET" ? undefined : await readBody(event);
    const result = await $fetch(path, {
      headers: {
        "Content-Type": "application/json",
        UserID: user.id,
      },
      method: event.method,
      body,
    });
    return result;
  });

export const defineUnprotectedEmolgaRoute = <D>(): EventHandler<
  EventHandlerRequest,
  D
> =>
  defineEventHandler<EventHandlerRequest>(async (event) => {
    const path = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    const body = event.method === "GET" ? undefined : await readBody(event);
    const result = await $fetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: event.method,
      body,
    });
    return result;
  });

export const defineEmolgaConfigStruct = () => defineEmolgaRoute<ConfigValue>();
export const defineEmolgaConfigContent = () => defineEmolgaRoute<any>();
export const defineEmolgaConfigSave = () => defineEmolgaRoute<any>();

export const defineStaticContentRoute = <D>(): EventHandler<
  EventHandlerRequest,
  D
> =>
  defineEventHandler<EventHandlerRequest>(async (event) => {
    const { user } = await requireUserSession(event);
    const path = `${useRuntimeConfig(event).emolgaBackendUrl}${event.path}`;
    if (event.method !== "GET") {
      throw createError({
        statusCode: 405,
        statusMessage: "Method Not Allowed",
      });
    }
    const result = await $fetch(path, {
      headers: {
        UserID: user.id,
      },
    });
    return result;
  });
