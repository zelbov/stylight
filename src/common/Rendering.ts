import { ContainedCSSProperties, ContainedMixins, CSSProperties, MediaQuery, ThemeStyleSheets } from "./ThemeTypings";

const BACKREF_UNAVAILABLE = (descriptor: string) => 'Parent scope reference requested for orphaned scope: '+descriptor
const NESTED_DESCRIPTOR_INVALID = (descriptor: string) => 'Nested style descriptor provided with invalid syntax: '+descriptor

const nestedCheckExpr = /^\&(?<target>(.|\s)+)/
const cssKeyExpr = new RegExp(/(^m(?=s))|([A-Z])/g)

type RenderScopeType = 'element' | 'nested' | 'media' | 'mixins' | 'global'

type ScopedRenderContext = {

    // current scope
    cs: string
    br: ScopedRenderContext | null
    type: RenderScopeType
    // target scopes & their nested rules or inner scopes
    tgs: { [key: string]: ScopedRenderContext }
    css?: string[]
    //TODO: strinfigy method

}

const prepareScopedRenderContext : (target: string, type: RenderScopeType, backref?: ScopedRenderContext) => ScopedRenderContext
= (target, type, backref) => {

    return {
        cs: target, br: backref || null, tgs: {}, css: [], type
    };

}

const renderScope = (scopeDescriptor: string, scopeCSS: string[]) : string => 
    scopeCSS.length == 0 ? '' :
    scopeDescriptor != ''
        ? `${scopeDescriptor} {${
            scopeCSS.map(css => css+';').join('')
        }}`
        : scopeCSS.join('')

const renderScopeRecursive = (ctx: ScopedRenderContext, prefix: string = '') : string => {

    let accumulator = ''
    prefix = prefix + ctx.cs

    if(ctx.css as string[]) accumulator += renderScope(
        prefix, (ctx as ScopedRenderContext).css as string[]
    )

    let inner = ctx.type != 'media'
        ? Object.keys(ctx.tgs).map($ => renderScopeRecursive(ctx.tgs[$], prefix)).join('')
        : ctx.cs+`{${Object.keys(ctx.tgs).map($ => renderScopeRecursive(ctx.tgs[$], '')).join('')}}`
    
    return accumulator + inner


}

const traverseBackrefs = (scope: ScopedRenderContext) => {

    if(scope.type == 'global') return scope;

    let parent = scope.br

    if(!parent) throw new Error(BACKREF_UNAVAILABLE(scope.cs))

    while(parent.br && parent.type != 'media') parent = parent!.br

    return parent

}

const describeMediaQueryTarget = (query: MediaQuery) => {

    const targets = Object.keys(query)
            .filter($ => $ != 'css')
            .sort()
            .map($ => {
                const value = query[$ as keyof MediaQuery] as string,
                    key = $.replace(cssKeyExpr, v => `-${v.toLowerCase()}`)
                return `(${key}${value.length ? `:${value}` : ''})`
            })
            .join(' and '),
        mediaTarget = `@media ${targets}`

    return mediaTarget

}

const renderCSS = (props: CSSProperties) => {

    return Object.keys(props).map(key => {

        const cssKey = ((str) => str.replace(cssKeyExpr, v => `-${v.toLowerCase()}`))(key)
        const cssValue = (props as CSSProperties)[key as keyof CSSProperties]

        return `${cssKey}:${cssValue}`

    }).join('')

}

const traverseToMediaHostDescriptor = (ctx: ScopedRenderContext) : string => {

    let scope = ctx,
        descriptor = ctx.cs

    switch(scope.type) {

        case 'nested':

            while(scope.type == 'nested') {
                const parent = scope.br
                if(!parent) throw new Error(BACKREF_UNAVAILABLE(scope.cs))
                scope = parent
                descriptor = parent.cs + descriptor
            }
            break;

        //TODO: case 'mixins'

    }

    return descriptor

}

const prepareScopedRenderPlan = <T extends Object>(sheet: ThemeStyleSheets<T> | ContainedCSSProperties, ctx: ScopedRenderContext) => {

    if(!ctx) ctx = prepareScopedRenderContext('', 'global');

    (Object.keys(sheet)).map(key => {

        const contents = sheet[key as keyof(ThemeStyleSheets<T> | ContainedCSSProperties)]

        // refuse to process undefined values e.g. forbidden "media" keyword inside "mixins" or global scope
        if(!contents && contents !== 0) return;

        switch(true) {

            case key == 'atRules': 

                const atScope = ctx.type == 'global' ? ctx : traverseBackrefs(ctx!)

                if(!atScope.css) atScope.css = []

                atScope.css.push(...contents as string[])

                break;

            case key == 'mixins':

                const mxScope = ctx.type == 'global' || ctx.type == 'mixins' ? ctx : traverseBackrefs(ctx!);

                (Object.keys(contents as ContainedMixins)).map(key => {

                    const target = key,
                        scopeCtx = (mxScope.tgs as {[key: string]: ScopedRenderContext })[target] =
                            prepareScopedRenderContext(target, 'mixins', mxScope)

                    prepareScopedRenderPlan((contents as ContainedMixins)[key], scopeCtx)

                })

                break;

            case key == 'media':
                
                let globalScope = traverseBackrefs(ctx!),
                    currentScopeDescriptor = traverseToMediaHostDescriptor(ctx);

                (contents as MediaQuery[]).map(query => {

                    const mediaTarget = describeMediaQueryTarget(query);

                    let mediaScope = (globalScope.tgs as {[key: string]: ScopedRenderContext })[mediaTarget]

                    if(!mediaScope)
                        mediaScope = (globalScope.tgs as {[key: string]: ScopedRenderContext })[mediaTarget] =
                            prepareScopedRenderContext(mediaTarget, 'media', globalScope)

                    mediaScope.tgs[currentScopeDescriptor] = prepareScopedRenderContext(currentScopeDescriptor, 'element', mediaScope)

                    prepareScopedRenderPlan(query.css as ContainedCSSProperties, mediaScope.tgs[currentScopeDescriptor])

                })

                break;

            case key == 'overrides':

                if(!ctx!.css) ctx!.css = [] as string[];

                (contents as CSSProperties[]).map(styles => {

                    ctx.css!.push(renderCSS(styles))

                })

                break;

            case typeof(key) == 'string' && key[0] == '&':

                const match = key.match(nestedCheckExpr);

                if(match) {

                    const nestedTarget = match.groups!.target;
                    
                    const nestedCtx = (ctx!.tgs as {[key: string]: ScopedRenderContext })
                        [nestedTarget] = prepareScopedRenderContext(nestedTarget, 'nested', ctx)
                    
                    prepareScopedRenderPlan(contents as ContainedCSSProperties, nestedCtx)

                    break;

                } else throw new Error(NESTED_DESCRIPTOR_INVALID(key))

            case ctx.type == 'global':

                const target = '.'+key,
                    scopeCtx = (ctx!.tgs as {[key: string]: ScopedRenderContext })[target] = prepareScopedRenderContext(target, 'element', ctx)

                prepareScopedRenderPlan(contents as ContainedCSSProperties, scopeCtx)

                break;

            default: 

                if(!ctx!.css) ctx!.css = [] as string[];

                (ctx!.css as string[]).push(renderCSS({[key]: contents as string | number }))

                break;

        }

    })

    return ctx;

}

export const renderStyleSheet = <T extends Object>(sheet: ThemeStyleSheets<T> | Omit<ContainedCSSProperties, 'media'>) => {

    const ctx = prepareScopedRenderContext('', 'global'),
        plan = prepareScopedRenderPlan(sheet, ctx),
        result = renderExplained(plan)

    // cleanup (GC)
    ctx.tgs = {}

    return result;

}

export const explainStyleSheet = <T extends Object>(sheet: ThemeStyleSheets<T> | Omit<ContainedCSSProperties, 'media'>) => 
    prepareScopedRenderPlan(sheet, prepareScopedRenderContext('', 'global'))

export const renderExplained = (ctx: ScopedRenderContext) => {

    return renderScope('', ctx.css || [])+Object.keys(ctx.tgs).map(key => {

        const target = (ctx!.tgs as {[key: string] : ScopedRenderContext})[key]
        const result = renderScopeRecursive(target)

        return result

    }).join('')

}