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
export type UsageDataTotal = {
  total: number;
  maxGameday: number;
  allLeagues: string[];
  data: { mon: string; count: number }[];
};

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type ConfigValue = XOR<
  { noconfig: boolean },
  { name: string; desc: string }
> &
  (
    | { type: PrimitiveConfigType }
    | { type: "LIST"; value: { "0": ConfigValue } }
    | { type: "ENUM"; value: Record<string, ConfigValue & { type: "OBJECT" }> }
    | { type: "CLASS"; value: ConfigObject }
    | { type: "MAP"; value: { "0": ConfigValue; "1": ConfigValue } }
    | { type: "SEALED"; value: { value: { value: ConfigObject } } }
  );
export type ConfigObject = Record<string, ConfigValue>;

type PrimitiveConfigType =
  | "INT"
  | "STRING"
  | "LONG"
  | "BOOLEAN"
  | "DOUBLE"
  | "OBJECT";
