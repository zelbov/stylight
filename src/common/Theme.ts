import { renderStyleSheet } from "./Rendering"
import { styledClass } from "./StyledClass"
import { ThemeStyleSheets } from "./ThemeTypings"


type ThemeInit<T extends Object> = {
    styles: ThemeStyleSheets<T>,
    styledClass: typeof styledClass<T>,
    render: () => ReturnType<typeof renderStyleSheet<T>>
}

export const createTheme = <T extends Object>(theme: ThemeStyleSheets<T>) : ThemeInit<T> => {

    return {
        styles: theme,
        styledClass: styledClass<T>,
        render: () => renderStyleSheet(theme)
    }

}