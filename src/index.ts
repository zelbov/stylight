import { renderStyleSheet } from './common/Rendering'
import { styledClass } from './common/StyledClass'
import { createTheme } from './common/Theme'

export { ThemeStyleSheets, CSSProperties } from './common/ThemeTypings'
export { renderStyleSheet, styledClass, createTheme }

// require
module.exports = { renderStyleSheet, styledClass, createTheme }

//@ts-ignore
global.Stylight = module.exports // UMD