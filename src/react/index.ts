import { useContext, createContext, createRef, useEffect, createElement } from 'react'
import { styledClass, renderMixins, renderStyleSheet, ThemeStyleSheets } from 'stylight';

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

    constructor(){ super(); this._sources = [] }

    private _sources: ThemeStyleSheets<any>[]

    addStyles(styles: ThemeStyleSheets<any>){
        if(!this._sources.find($ => $ === styles)) {
            this._sources.push(styles)
            this.dispatchEvent(new StyleRenderEvent(styles))
        }
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

export const StyleRenderer = () => {

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    const ref = createRef<HTMLStyleElement>()

    function listenStyles(style: StyleRenderEvent) {
        if(ref.current)
            ref.current.innerHTML += '\n'+renderStyleSheet(style.source)+'\n'+renderMixins(style.source)
    }

    useEffect(() => {

        ctx.target.addEventListener('style', listenStyles)

        return () => ctx.target.removeEventListener('style', listenStyles)

    })

    return createElement('style', { ref })

}