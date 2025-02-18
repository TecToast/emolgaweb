import type { User } from "#auth-utils";

export const MY_DISCORD_TAG = "@tectoast";
export const BOT_INVITE_URL =
  "https://discord.com/api/oauth2/authorize?client_id=723829878755164202&permissions=3072&scope=bot";

export function convertLeagueIDToName(leagueid: string) {
  return leagueid.replace(/(.+)S(\d+)L?(\d+)?/g, "$1 Saison $2 Liga $3");
}

export function buildAvatarURLFromUser(user: User) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`;
}

export type GuildMeta = { name: string; icon: string; id: string };
