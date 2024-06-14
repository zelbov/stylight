import React, { useContext, createContext, useEffect, createElement } from 'react'
import { DEFAULT_SEED_FUNCTION, SeedStringOrFunction, assignSeedString } from '../common/Seed';
import { styledClass, renderStyleSheet, StyleSheetObject, StyleSheetInit } from 'stylight';

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

    private _sources: { styles: (StyleSheetObject<any> | StyleSheetInit<any>), seed?: SeedStringOrFunction }[]

    public get sources() { return this._sources }

    private _renderedFlags: boolean[];

    addStyles(styles: StyleSheetObject<any> | StyleSheetInit<any>, seed?: SeedStringOrFunction){
        if(!this._sources.find($ => $ === styles)) {
            this._sources.push({styles, seed})
            this._renderedFlags.push(false)
            this.dispatchEvent(new StyleRenderEvent(styles, seed))
        }
    }

}

class StyleRenderEvent extends Event {

    private _source: StyleSheetObject<any> | StyleSheetInit<any>
    private _seed?: SeedStringOrFunction

    constructor(source: StyleSheetObject<any> | StyleSheetInit<any>, seed?: SeedStringOrFunction){
        super('style')
        this._source = source
        this._seed = seed
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
    source: StyleSheetObject<T> | StyleSheetInit<T>,
    seed: SeedStringOrFunction = DEFAULT_SEED_FUNCTION
) => {

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    ctx.target.addStyles(source, seed)

    if((source as StyleSheetInit<T>).styledClass)
        return (source as StyleSheetInit<T>).styledClass

    const seedAlgorithm = typeof(seed) == 'string' ? assignSeedString(seed) : seed

    return (...keys: (keyof Omit<StyleSheetObject<T>, 'literals'> | null | undefined | String)[]) => styledClass(...(
        keys.map($ => typeof($) == 'string' ? seedAlgorithm($) : undefined)
    ))

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
            ({ styles, seed }) => 
                (styles && styles.styledClass)
                ? (styles as StyleSheetInit<any>).render()
                : seed ? renderStyleSheet(styles, typeof(seed) == 'string' ? assignSeedString(seed) : seed) : renderStyleSheet(styles)
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
