import { Properties } from 'csstype'

// React-compatible
export type CSSProperties = Properties<string | number>

export type ContainedCSSProperties =
CSSProperties &
{
    [key: `&${string}`]: ContainedCSSProperties,
    [key: `${'width' | 'height'}${number}${string}`]: ContainedCSSProperties,
    overrides?: CSSProperties[]
} &
{ [key: string]: unknown }

export type ContainedMixins = { [key: string]: ContainedCSSProperties }

type ThemeContainedSheet <T extends Object> = {
[P in keyof T]?: ContainedCSSProperties;
}

export type ThemeStyleSheets<T extends Object> = ThemeContainedSheet<T> & { mixins?: ContainedMixins }