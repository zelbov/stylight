import { renderStyleSheet } from './common/Rendering'
import { styledClass } from './common/StyledClass'

export { ThemeStyleSheets, CSSProperties } from './common/ThemeTypings'
export { renderStyleSheet, styledClass }

// require
module.exports = { renderStyleSheet, styledClass }

//@ts-ignore
global.Stylight = module.exports // UMD