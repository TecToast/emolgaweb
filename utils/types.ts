import type {Avatar} from "#ui/types";

export type AdvancedPokemonData = {
    displayName: string,
    sdName: string,
    types: string[],
    pointsOrTier: string,
}
export type DraftPokemon = {
    name: string,
    tier: string
}
export type UserData = {
    global_name: string,
    avatar: string
}
export type League = {
    name: string
    picks: AdvancedPokemonData[],
    isRunning: boolean,
    logoUrl: string
}
export type ExtendedLeague = League & {
    valid: boolean
}
