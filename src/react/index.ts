import React, { useContext, createContext, useEffect, createElement } from 'react'
import { StyleSheetInit } from 'src/common/Isolated';
import { styledClass, renderStyleSheet, StyleSheetObject } from 'stylight';

const MISSING_RENDERING_CONTEXT_ERROR = 'Need to instantiate top-level StyleRenderingContext.Provider'
const ASYNC_STYLE_PARENT_MISSING = 'No parent element to append asynchronously appeared style'

const HYDRATE_INDEXING_ATTRIBUTE_NAME = 'data-hydrate-idx'

interface StyleEventListener {
    (evt: StyleRenderEvent): void
}

interface StyleEventListenerObject {
    handleEvent(object: StyleRenderEvent): void;
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
    }

    private _sources: (StyleSheetObject<any> | StyleSheetInit<any>)[]

    public get sources() { return this._sources }

    private _renderedFlags: boolean[];

    addStyles(styles: StyleSheetObject<any> | StyleSheetInit<any>){
        if(!this._sources.find($ => $ === styles)) {
            this._sources.push(styles)
            this._renderedFlags.push(false)
            this.dispatchEvent(new StyleRenderEvent(styles))
        }
    }

}

class StyleRenderEvent extends Event {

    private _source: StyleSheetObject<any> | StyleSheetInit<any>

    constructor(source: StyleSheetObject<any> | StyleSheetInit<any>){
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

export const useStyle = <T extends Object>(
    source: StyleSheetObject<T> | StyleSheetInit<T>
) => {

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    ctx.target.addStyles(source)

    if((source as StyleSheetInit<T>).styledClass)
        return (source as StyleSheetInit<T>).styledClass

    return (...keys: (keyof Omit<StyleSheetObject<T>, 'mixins'> | null | undefined | String)[]) => styledClass(...keys)

}

interface StyleRendererProps {

    onrender?: () => void
    wrap?: (element: React.ReactElement) => React.ReactElement

}

export const StyleRenderer = (props: StyleRendererProps) => {

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    const { wrap } = props

    const styles = ctx.target.sources.map(
            (source) => (source.styles && source.styledClass) ? (source as StyleSheetInit<any>).render() : renderStyleSheet(source)
        ).join('')

    useEffect(() => {

        const listener : StyleEventListener = function(style) {

            const current = document.querySelector(`style[${HYDRATE_INDEXING_ATTRIBUTE_NAME}="${ctx.target.sources.length - 1}"]`)

            if(!current) {

                const any = document.querySelector(`style[${HYDRATE_INDEXING_ATTRIBUTE_NAME}]`)

                const parent = any ? any.parentElement : document.head

                if(!parent) throw new Error(ASYNC_STYLE_PARENT_MISSING)

                const append = document.createElement('style')
                append.setAttribute(HYDRATE_INDEXING_ATTRIBUTE_NAME, ((ctx.target.sources.length || 1) - 1).toString())
                append.innerText = renderStyleSheet(style.source)
                parent.appendChild(append)

            }

        }

        ctx.target.addEventListener('style', listener)

        return () => ctx.target.removeEventListener('style', listener)

    })

    const element = createElement('style', {
        type: 'text/css',
        [HYDRATE_INDEXING_ATTRIBUTE_NAME]: 0
    }, styles)

    return wrap ? wrap(element) : element

}

export const Styled = (props: { children?: React.ReactNode[] }) => {

    return createElement(StyleRenderingContext.Provider, { value: createStyleRenderingContext() }, ...(props.children || []))

}
