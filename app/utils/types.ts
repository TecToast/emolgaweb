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

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type ConfigValue = {
  nullable?: string;
  delta?: boolean;
  submit?: string;
  keyIsDiscordUser?: boolean;
} & XOR<
  { noconfig: boolean },
  {
    name: string;
    desc: string;
    longType?: "CHANNEL" | "MEMBER" | "ROLE";
    prio?: number;
  }
> &
  (
    | { type: PrimitiveConfigType }
    | { type: "LIST"; value: { "0": ConfigValue }; listtype?: string }
    | { type: "ENUM"; value: Record<string, ConfigValue & { type: "OBJECT" }> }
    | { type: "CLASS"; value: ConfigObject }
    | {
        type: "MAP";
        value: { "0": ConfigValue; "1": ConfigValue };
        maptype?: string;
      }
    | { type: "SEALED"; sealed: string; value: ConfigObject }
  );
export type ConfigObject = Record<string, ConfigValue>;

type PrimitiveConfigType =
  | "INT"
  | "STRING"
  | "LONG"
  | "BOOLEAN"
  | "DOUBLE"
  | "OBJECT"
  | "CONTEXTUAL";
