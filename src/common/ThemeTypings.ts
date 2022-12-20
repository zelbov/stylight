import { Properties } from 'csstype'

// React-compatible
export type CSSProperties = Properties<string | number>

type MediaFeatures = {

    //TODO: add type definitions for all media types and features
    //e.g. orientation, any-hover, hover, etc

} & {
    
    // allows custom media features without typechecking support
    [key: string]: unknown

}

type ResolutionMediaFeatures = { [key in `${'min' | 'max'}-${'width' | 'height'}`]?: string }

export type MediaQuery =
MediaFeatures &
ResolutionMediaFeatures &
{ css: Omit<ContainedCSSProperties, 'media'> }

export type ContainedCSSProperties =
CSSProperties &
{
    [key: `&${string}`]: ContainedCSSProperties,
    overrides?: CSSProperties[]
    media?: MediaQuery[],
    mixins?: ContainedMixins
}

export type ContainedMixins = { [key: string]: ContainedCSSProperties }

type ThemeContainedSheet <T> = {
    [P in keyof T]?: ContainedCSSProperties;
}

export type ThemeStyleSheets<T> = 
& ThemeContainedSheet<T>
