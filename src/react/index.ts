import React, { useContext, createContext, useEffect, useState, createElement } from 'react'
import { styledClass, renderStyleSheet, ThemeStyleSheets } from 'stylight';

const MISSING_RENDERING_CONTEXT_ERROR = 'Need to instantiate top-level StyleRenderingContext.Provider'

interface StyleEventListener {
    (evt: StyleRenderEvent): void
}

interface StyleEventListenerObject {
    handleEvent(object: Event): void;
}

declare interface StyleContextListener {

    addEventListener(type: 'style', callback: StyleEventListener | StyleEventListenerObject | null): void
    removeEventListener(type: 'style', callback: StyleEventListener | StyleEventListenerObject | null): void

}

class StyleContextListener extends EventTarget {

    constructor(){
        super();
        this._sources = [];
        this._renderedFlags = [];
        this._cache = ''
    }

    private _sources: ThemeStyleSheets<any>[]

    private _renderedFlags: boolean[];

    private _cache: string;

    addStyles(styles: ThemeStyleSheets<any>){
        if(!this._sources.find($ => $ === styles)) {
            this._sources.push(styles)
            this._renderedFlags.push(false)
            this.dispatchEvent(new StyleRenderEvent(styles))
        }
    }

    renderAll(){

        this._sources.map(($, idx) => {
            if(!this._renderedFlags[idx]) {
                this._cache += renderStyleSheet($)
                this._renderedFlags[idx] = true
            }
        })

        return this._cache

    }

}

class StyleRenderEvent extends Event {

    private _source: ThemeStyleSheets<any>

    constructor(source: ThemeStyleSheets<any>){
        super('style')
        this._source = source
    }

    public get source() { return this._source }

}

type StyleRenderingContextValue = { readonly target: StyleContextListener }

export const createStyleRenderingContext = () => {

    const target = new StyleContextListener()

    return { target } as StyleRenderingContextValue

}

export const StyleRenderingContext = createContext<StyleRenderingContextValue | null>(null)

export const useStyle = <T extends Object>(source: ThemeStyleSheets<T>) => {

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    ctx.target.addStyles(source)

    return (...keys: (keyof Omit<typeof source, 'mixins'> | null)[]) => styledClass(...keys)

}

interface StyleRendererProps {

    onrender?: () => void
    wrapElement?: (element: React.ReactElement) => React.ReactElement
    wrapContent?: (content: string) => React.ReactElement

}

export const StyleRenderer = (props: StyleRendererProps) => {

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    const [contents, setContents] = useState<string>(ctx.target.renderAll())

    function listenStyles() {
        if(ctx) setContents(ctx.target.renderAll())
        if(props.onrender) props.onrender()
    }

    ctx.target.addEventListener('style', listenStyles)

    useEffect(() => () => ctx.target.removeEventListener('style', listenStyles))

    const { wrapElement, wrapContent } = props;

    if(wrapElement) {

        return wrapElement(createElement('style', { type: 'text/css' }, contents))

    } else if (wrapContent) {

        return wrapContent(contents)
        
    } else return createElement('style', { type: 'text/css' }, contents)

}

export const Styled = (props: { children?: React.ReactNode[] }) => {

    return createElement(StyleRenderingContext.Provider, { value: createStyleRenderingContext() }, ...(props.children || []))

}

// require
module.exports = { StyleRenderer, useStyle, StyleRenderingContext, createStyleRenderingContext, Styled }

//@ts-ignore
global.StylightReact = module.exports // UMD