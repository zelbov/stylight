import { Properties } from 'csstype'

// React-compatible
export type CSSProperties = Properties<string | number>

interface AllowedUntypedProperties {

    [key: string]: unknown

}

type ResolutionMediaFeatures = { [key in `${'min' | 'max'}-${'width' | 'height'}`]?: string }

interface MediaFeatures extends AllowedUntypedProperties, ResolutionMediaFeatures {

    //TODO: add type definitions for all media types and features
    //e.g. orientation, any-hover, hover, etc

}

export interface MediaQuery
extends MediaFeatures, ResolutionMediaFeatures
{
    css: Omit<ContainedCSSProperties, 'media'>
}

type DigitLiteral = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type PercentageLiteral = 
`${Exclude<DigitLiteral, 0> | ''}${DigitLiteral}` | '100'

export type KeyframesStepPercentage = {

    percentage: PercentageLiteral
    css: CSSProperties

}

export type KeyframesStepFromTo = {

    from: CSSProperties,
    to: CSSProperties

}

export type KeyframesRule = {

    name: string
    steps: (KeyframesStepPercentage | KeyframesStepFromTo)[]

}

export interface ContainedCSSProperties extends CSSProperties {

    [key: `&${string}`]: ContainedCSSProperties,
    overrides?: CSSProperties[]
    atRules?: string[],
    keyframes?: KeyframesRule[],
    media?: MediaQuery[],
    mixins?: ContainedMixins
}

export type ContainedMixins = {
    [key: string]: ContainedCSSProperties & { mixins?: never }
} & { mixins?: never, media?: never }

type ContainedStyleSheet <T> = {
    [P in keyof T]?: ContainedCSSProperties;
}

export type StyleSheetObject<T> = 
& ContainedStyleSheet<T> & {
    mixins?: ContainedMixins
}
