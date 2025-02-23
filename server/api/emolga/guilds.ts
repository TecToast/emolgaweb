import type { GuildMeta } from "~/utils/types";
import { defineEmolgaRoute } from "~~/server/utils/authenticated";

export default defineEmolgaRoute<GuildMeta[]>();
