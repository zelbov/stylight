
export type SeedFunction = ((target: string) => string)

export type SeedStringOrFunction = string | SeedFunction

export const DEFAULT_SEED_FUNCTION : SeedFunction = (target: string) => target

export const assignSeedString = (seed: string) => (target: string) => 
    Buffer ? Buffer.from(seed+target).toString('base64') : window ? window.btoa(seed+target) : seed+target