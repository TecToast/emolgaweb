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
