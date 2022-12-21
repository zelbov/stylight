import { createTheme, explainStyleSheet, renderExplained, renderStyleSheet, styledClass } from "."

// require
module.exports = { renderStyleSheet, styledClass, createTheme, explainStyleSheet, renderExplained }

//@ts-ignore
global.Stylight = module.exports // UMD