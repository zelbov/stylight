import { ContainedCSSProperties, ContainedMixins, CSSProperties, MediaQuery, ThemeStyleSheets } from "./ThemeTypings";

type RenderContext = {

    nestedTargets : { target: string, css: string }[],
    mediaTargets: { target: string, css: string }[],
    mixinTargets: { target: string, css: string }[]

}

const prepareContext = () : RenderContext => {

    const nestedTargets : { target: string, css: string }[] = [];
    const mediaTargets: { target: string, css: string }[] = [];
    const mixinTargets: { target: string, css: string }[] = []

    return { nestedTargets, mediaTargets, mixinTargets }

}

const cssKeyExpr = new RegExp(/[A-Z]/g);

const renderOverrides = (props: ContainedCSSProperties, accumulator: string, context: RenderContext) => {

    const renderedOverrides = ((props as { overrides: CSSProperties[] }).overrides as CSSProperties[])
        .map($ =>
            renderStyles($, '', '', context)
                .replace(/(^\s*?\{)|(\}\s*$)/g, '')
            )
        .join('')

    return `${accumulator}${renderedOverrides}`

}

const prepareMediaQueries = (media: MediaQuery[], targetKey: string, context: RenderContext) => {

    return media.map(query => {

        const targets = Object.keys(query)
            .filter($ => $ != 'css')
            .sort()
            .map($ => {
                const value = query[$ as keyof MediaQuery] as string,
                    key = $.replace(cssKeyExpr, v => `-${v.toLowerCase()}`)
                return `(${key}${value.length ? `: ${value}` : ''})`
            })
            .join(' and '),
        mediaTarget = `@media ${targets}`,
        css = renderStyles(query.css, '', '\n.'+targetKey, context),
        obj = { target: mediaTarget, css }

        return obj

    })

}

const groupMediaQueries = (queries: { target: string, css: string }[]) => {

    const accumulators : {[query: string]: string} = {}

    queries.map(query => accumulators[query.target] = (accumulators[query.target] || '')+query.css)
    
    return Object.keys(accumulators).map($ => $+' {'+accumulators[$]+'}')

}

const prepareMixins = (props: { mixins: ContainedMixins }, context: RenderContext) => {

    const mixins = Object.keys(props.mixins).map(target => {

        const obj = {
            target, css: renderStyles(props.mixins[target], '\n', '', context)
        }

        return obj

    })

    return mixins

}

const groupMixins = (mixins: { target: string, css: string }[]) => {

    const accumulators : {[mixin: string]: string} = {}

    mixins.map(mixin => accumulators[mixin.target] = (accumulators[mixin.target] || '')+mixin.css)

    return Object.keys(accumulators).map($ => $+accumulators[$])

}

const nestedCheckExpr = /^\&(?<target>(.|\s)+)/

const prepareNestedTarget = (props: ContainedCSSProperties, target: string, key: string, match: RegExpMatchArray, context: RenderContext) => {

    const nestedTarget = target + match.groups!.target,
        obj = {
            target: nestedTarget,
            css: renderStyles(props[key as keyof ContainedCSSProperties] as ContainedCSSProperties, '\n'+key, nestedTarget, context)
        };

    return obj

}

const renderStyles = (
    props: ContainedCSSProperties | CSSProperties,
    targetKey: string,
    target: string,
    context: RenderContext
) : string => {

    const { nestedTargets, mediaTargets, mixinTargets } = context

    const result = Object.keys(props as CSSProperties).reduce((accumulator, key) => {

        if(key == 'mixins') {

            const mixins = prepareMixins(props as { mixins: ContainedMixins }, context)

            mixinTargets.push(...mixins)

            return accumulator

        } 

        if(key == 'media') {

            const queries = prepareMediaQueries((props as ContainedCSSProperties).media as MediaQuery[], targetKey, context)

            mediaTargets.push(...queries)

            return accumulator;

        }

        if(key == 'overrides') return renderOverrides(props as ContainedCSSProperties, accumulator, context)

        let nestedMatch = key.match(nestedCheckExpr);

        if(nestedMatch) {

            nestedTargets.push(prepareNestedTarget(props as ContainedCSSProperties, target, key, nestedMatch, context));

            return accumulator;

        }

        const cssKey = ((str) => str.replace(cssKeyExpr, v => `-${v.toLowerCase()}`))(key)
        const cssValue = (props as ContainedCSSProperties)[key as keyof ContainedCSSProperties]

        return `${accumulator}${cssKey}:${cssValue};`


    }, '');

    return `${ result.length ? `${target} {${result}}` : ''}`

}

export const renderStyleSheet = <T extends Object>(theme: ThemeStyleSheets<T>) => {

    const context = prepareContext()

    return Object.keys(theme)
        .map(
            key => theme[key as keyof typeof theme] 
                ? renderStyles(theme[key as keyof T]!, key, '\n.'+key, context)
                : ''
        ).join('')
        +`${
            context.nestedTargets.length ? context.nestedTargets.map(t => t.css).join('') : ''
        }${
            context.mediaTargets.length ? groupMediaQueries(context.mediaTargets) : ''
        }${
            context.mixinTargets.length ? groupMixins(context.mixinTargets) : ''
        }`

}
