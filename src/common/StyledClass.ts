import { ThemeStyleSheets } from "./ThemeTypings";


export const styledClass = <T extends Object>(...keys: (keyof Omit<ThemeStyleSheets<T>, 'mixins'> | null)[]) => {

    return keys.filter($ => $ !== null).join(' ');

}