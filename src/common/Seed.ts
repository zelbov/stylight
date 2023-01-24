
export type SeedFunction = ((target: string) => string)

export type SeedStringOrFunction = string | SeedFunction

export const DEFAULT_SEED_FUNCTION : SeedFunction = (target: string) => target

export const assignSeedString = (seed: string) => (target: string) => btoa(seed+target)