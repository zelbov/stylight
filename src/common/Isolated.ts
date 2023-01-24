import { renderStyleSheet } from "./Rendering"
import { assignSeedString, DEFAULT_SEED_FUNCTION, SeedStringOrFunction } from "./Seed"
import { styledClass } from "./StyledClass"
import { ThemeStyleSheets } from "./SheetTypings"


type ThemeInit<T extends Object> = {
    styles: ThemeStyleSheets<T>,
    styledClass: typeof styledClass<T>,
    render: () => ReturnType<typeof renderStyleSheet<T>>
}



export const createStyleSheet = <T extends Object>(
    theme: ThemeStyleSheets<T>,
    seed: SeedStringOrFunction = DEFAULT_SEED_FUNCTION
) : ThemeInit<T> => {

    return {
        styles: theme,
        styledClass: styledClass<T>,
        render: () => renderStyleSheet(theme, typeof(seed) == 'string' ? assignSeedString(seed) : seed)
    }

}