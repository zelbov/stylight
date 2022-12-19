import { renderStyleSheet, renderMixins } from './common/Rendering'
import { styledClass } from './common/StyledClass'

export { ThemeStyleSheets, CSSProperties } from './common/ThemeTypings'
export { renderStyleSheet, renderMixins, styledClass }

// require
module.exports = { renderStyleSheet, renderMixins, styledClass }

//@ts-ignore
global.Stylight = module.exports // UMD