import { createStyleSheet, explainStyleSheet, renderExplained, renderStyleSheet, styledClass } from "."

// require
module.exports = { renderStyleSheet, styledClass, createStyleSheet, explainStyleSheet, renderExplained }

//@ts-ignore
global.Stylight = module.exports // UMD