import React, { useContext, createContext, useEffect, createElement, useState, createRef } from 'react'
import { DEFAULT_SEED_FUNCTION, SeedStringOrFunction, assignSeedString } from '../common/Seed';
import { styledClass, renderStyleSheet, StyleSheetObject, StyleSheetInit } from 'stylight';

const MISSING_RENDERING_CONTEXT_ERROR = 'Need to instantiate top-level StyleRenderingContext.Provider'
const ASYNC_STYLE_PARENT_MISSING = 'No parent element to append asynchronously appeared style'

const HYDRATE_INDEXING_ATTRIBUTE_NAME = 'data-uid'

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
    }

    private _sources: { styles: (StyleSheetObject<any> | StyleSheetInit<any>), seed?: SeedStringOrFunction }[]

    public get sources() { return this._sources }

    addStyles(styles: StyleSheetObject<any> | StyleSheetInit<any>, seed?: SeedStringOrFunction){
        this._sources.push({styles, seed})
        this.dispatchEvent(new StyleRenderEvent(this._sources.length - 1, styles, seed))
    }

    mutateStyle(idx: number, styles: StyleSheetObject<any> | StyleSheetInit<any>, seed?: SeedStringOrFunction) {
        if(!this._sources[idx]) throw new Error('Could not mutate stylesheet with idx '+idx+' as it does not exist in rendering context')
        this._sources[idx] = {styles, seed}
        this.dispatchEvent(new StyleRenderEvent(idx, styles, seed))
    }

}

class StyleRenderEvent extends Event {

    private _source: StyleSheetObject<any> | StyleSheetInit<any>
    private _seed?: SeedStringOrFunction
    private _hydrateIdx: number

    constructor(hydrateIdx: number, source: StyleSheetObject<any> | StyleSheetInit<any>, seed?: SeedStringOrFunction){
        super('style')
        this._hydrateIdx = hydrateIdx
        this._source = source
        this._seed = seed
    }

    public get source() { return this._source }

    public get uid() { return this._hydrateIdx }

    public get seed() { return this._seed }

}

type StyleRenderingContextValue = { readonly target: StyleContextListener }

export const createStyleRenderingContext = () => {

    const target = new StyleContextListener()

    return { target } as StyleRenderingContextValue

}

export const StyleRenderingContext = createContext<StyleRenderingContextValue | null>(null)

export const useStyle = <T extends Object>(
    source: StyleSheetObject<T> | StyleSheetInit<T>,
    options: {
        seed?: SeedStringOrFunction,
        mutate?: () => boolean
    } = { seed: DEFAULT_SEED_FUNCTION }
) => {

    if(!options.seed) options.seed = DEFAULT_SEED_FUNCTION

    const ctx = useContext(StyleRenderingContext)

    if(!ctx) throw new Error(MISSING_RENDERING_CONTEXT_ERROR)

    const [idx] = useState(ctx.target.sources.length)

    if(idx >= ctx.target.sources.length) ctx.target.addStyles(source, options.seed)
    else if(options.mutate) {
        if(typeof(options.mutate) == 'function')
            options.mutate() ? ctx.target.mutateStyle(idx, source, options.seed) : null
        else throw new Error('options.mutate property must be of function type')
    }

    if((source as StyleSheetInit<T>).styledClass)
        return (source as StyleSheetInit<T>).styledClass

    const seedAlgorithm = typeof(options.seed) == 'string' ? assignSeedString(options.seed) : options.seed

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
        ).join(''),
        ref = createRef<HTMLStyleElement>()

    useEffect(() => {

        const listener : StyleEventListener = function(style) {

            const { uid, source, seed } = style

            const parent = ref.current ? ref.current.parentNode : document.head

            if(!parent) throw new Error(ASYNC_STYLE_PARENT_MISSING)

            const current = parent.querySelector(`style[${HYDRATE_INDEXING_ATTRIBUTE_NAME}="${uid}"]`)

            if(!current) {

                const append = document.createElement('style')
                append.setAttribute('type', 'text/css')
                append.setAttribute(HYDRATE_INDEXING_ATTRIBUTE_NAME, uid.toString())
                append.innerText = renderStyleSheet(source, typeof(seed) == 'string' ? assignSeedString(seed) : seed)
                parent.appendChild(append)

            } else {
                
                current.innerHTML = renderStyleSheet(source, typeof(seed) == 'string' ? assignSeedString(seed) : seed)

            }

        }

        ctx.target.addEventListener('style', listener)

        return () => ctx.target.removeEventListener('style', listener)

    })

    const element = createElement('style', {
        type: 'text/css',
        ref,
        [HYDRATE_INDEXING_ATTRIBUTE_NAME]: -1
    }, styles)

    return wrap ? wrap(element) : element

}

export const Styled = (props: { children?: React.ReactNode[] }) => {

    return createElement(StyleRenderingContext.Provider, { value: createStyleRenderingContext() }, ...(props.children || []))

}
