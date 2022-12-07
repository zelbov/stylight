import { CSSProperties, ThemeStyleSheets } from "./ThemeTypings";

//TODO: separate function onto logical chunks

const renderStyles = (props: CSSProperties | CSSProperties[], target: string) : string => {

    const cssKeyExpr = new RegExp(/[A-Z]/g);

    const nestedTargets : { target: string, css: string }[] = [];
    const mediaTargets: { target: string, css: string }[] = [];

    const result = Object.keys(props as CSSProperties).reduce((accumulator, key) => {

        if(key == 'overrides') {

            const renderedOverrides = ((props as { overrides: CSSProperties[] }).overrides as CSSProperties[])
                .map($ =>
                    renderStyles($, '')
                        .replace(/(^\s*?\{)|(\}\s*$)/g, '')
                    )
                .join('')

            return `${accumulator}${renderedOverrides}`

        }

        let nestedMatch = key.match(/^\&(?<target>(.|\s)+)/);

        if(nestedMatch) {

            const nestedTarget = target + nestedMatch.groups!.target,
                obj = {
                    target: nestedTarget,
                    css: renderStyles((props as {[key: string]: CSSProperties})[key], nestedTarget)
                };

            nestedTargets.push(obj);

            return `${accumulator}`;

        }

        let devMatch = key.match(/^(?<param>(width|height))(?<value>(\d+)(\w){1,3})/)

        if(devMatch) {

            const { param, value } = devMatch.groups! as { param: string, value: string }

            const mediaTarget = `@media all and (max-${param}: ${value})`,
                obj = {
                    target: mediaTarget,
                    css: renderStyles((props as {[key: string]: CSSProperties})[key], target)
                }

            mediaTargets.push(obj)

            return `${accumulator}`;

        }

        const cssKey = ((str) => str.replace(cssKeyExpr, v => `-${v.toLowerCase()}`))(key)
        const cssValue = (props as {[key: string]: CSSProperties})[key]

        return `${accumulator}${cssKey}:${cssValue};`


    }, '');

    return `${target} {${result}}\n${
        nestedTargets.length ? nestedTargets.map(t => t.css).join('')+'\n' : ''
    }${
        mediaTargets.length ? mediaTargets.map(t => `${t.target} {\n${t.css}}`).join('')+'\n' : ''
    }`

}

export const renderStyleSheet = <T extends Object>(theme: ThemeStyleSheets<T>) => {

    return '\n'+Object.keys(theme)
        .filter(key => key != 'mixins')
        .map(key => theme[key as keyof T] ? renderStyles(theme[key as keyof T]!, '.'+key) : '')
        .join('\n')

}

export const renderMixins = <T extends Object>(theme: ThemeStyleSheets<T>) => {

    if(!theme.mixins) return ''

    return '\n'+Object.keys(theme.mixins)
        .map(key => renderStyles(theme.mixins![key], key))
        .join('')

}