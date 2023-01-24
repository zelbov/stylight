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

export interface ContainedCSSProperties extends CSSProperties {

    [key: `&${string}`]: ContainedCSSProperties,
    overrides?: CSSProperties[]
    atRules?: string[],
    media?: MediaQuery[],
    mixins?: ContainedMixins
}

export type ContainedMixins = {
    [key: string]: ContainedCSSProperties & { mixins?: never }
} & { mixins?: never, media?: never}

type ThemeContainedSheet <T> = {
    [P in keyof T]?: ContainedCSSProperties;
}

export type ThemeStyleSheets<T> = 
& ThemeContainedSheet<T> & {
    mixins?: ContainedMixins
}
