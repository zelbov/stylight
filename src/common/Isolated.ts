import { renderStyleSheet } from "./Rendering"
import { assignSeedString, DEFAULT_SEED_FUNCTION, SeedStringOrFunction } from "./Seed"
import { styledClass } from "./StyledClass"
import { StyleSheetObject } from "./SheetTypings"


export type StyleSheetInit<T extends Object> = {
    styles: StyleSheetObject<T>,
    styledClass: typeof styledClass<T>,
    render: () => ReturnType<typeof renderStyleSheet<T>>
}

export const createStyleSheet = <T extends Object>(
    source: StyleSheetObject<T>,
    seed: SeedStringOrFunction = DEFAULT_SEED_FUNCTION
) : StyleSheetInit<T> => {

    const seedAlgorithm = typeof(seed) == 'string' ? assignSeedString(seed) : seed

    return {
        styles: source,
        styledClass: <T extends Object>(...keys: (keyof Omit<StyleSheetObject<T>, 'literals'> | null | undefined | String)[]) => styledClass<T>(
            ...(
                keys.map(
                    $ => typeof($) == 'string'
                        ? Object.keys(source).indexOf($) != -1 ? seedAlgorithm($) : $
                        : undefined
                    )
            )
        ),
        render: () => renderStyleSheet(source, seedAlgorithm)
    }

}