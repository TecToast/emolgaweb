import type { User } from "#auth-utils";
export const ALPHA = true;
export const MY_DISCORD_TAG = "@tectoast";
export const BOT_INVITE_URL =
  "https://discord.com/api/oauth2/authorize?client_id=723829878755164202&permissions=3072&scope=bot";
export const DISCORD_SERVER_INVITE_URL = "https://discord.gg/zakJ4p4mUf";

export function convertLeagueIDToName(leagueid: string) {
  return leagueid.replace(/(.+)S(\d+)L?(\d+)?/g, "$1 Saison $2 Liga $3");
}

export function buildAvatarURLFromUser(user: User) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`;
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
}
