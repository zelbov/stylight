import { renderStyleSheet } from "./Rendering"
import { styledClass } from "./StyledClass"
import { ThemeStyleSheets } from "./ThemeTypings"


type ThemeInit<T extends Object> = {
    theme: ThemeStyleSheets<T>,
    styledClass: typeof styledClass<T>,
    render: () => ReturnType<typeof renderStyleSheet<T>>,
    extend: <ET extends Object>(withStyles: ThemeStyleSheets<ET>) => ThemeInit<T & ET>
}

export const createTheme = <T extends Object>(theme: ThemeStyleSheets<T>) : ThemeInit<T> => {

    const extend = <ET extends Object>(withStyles: ThemeStyleSheets<ET>) : ThemeInit<T & ET> => {
        Object.assign(theme, withStyles)
        return createTheme(theme as ThemeStyleSheets<T & ET>)
    }

    return {
        theme,
        styledClass: styledClass<T>,
        render: () => renderStyleSheet(theme),
        extend
    }

}