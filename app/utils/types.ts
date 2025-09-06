export type GuildMeta = { id: string; name: string; icon: string };
export type ParticipantData = {
  users: UserData[];
  data: Record<string, string>;
  conference?: string;
};
export type UserData = {
  id: string;
  name: string;
  avatar: string;
};
export type ResultCodeResponse = {
  guildName: string;
  logoUrl: string | null;
  gameday: number;
  bo3: boolean;
  data: {
    name: string;
    avatarUrl: string;
    picks: {
      tlName: string;
      spriteName: string;
    }[];
  }[];
};
export type UsageDataTotal = {
  total: number;
  maxGameday: number;
  allLeagues: string[];
  data: { mon: string; count: number }[];
};
