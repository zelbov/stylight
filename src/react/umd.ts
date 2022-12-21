import { createStyleRenderingContext, Styled, StyleRenderer, StyleRenderingContext, useStyle } from "."

// require
module.exports = { StyleRenderer, useStyle, StyleRenderingContext, createStyleRenderingContext, Styled }

//@ts-ignore
global.StylightReact = module.exports // UMD