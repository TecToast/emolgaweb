import type { ParticipantData } from "~/utils/types";
import { defineEmolgaRoute } from "~~/server/utils/authenticated";

export default defineEmolgaRoute<{
  conferences: string[];
  data: ParticipantData[];
}>();
