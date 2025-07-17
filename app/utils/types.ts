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
  data: {
    name: string;
    avatarUrl: string;
    picks: {
      german: string;
      english: string;
    }[];
  }[];
};
