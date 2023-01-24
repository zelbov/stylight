import { ThemeStyleSheets } from "./SheetTypings";


export const styledClass = <T extends Object>(...keys: (keyof Omit<ThemeStyleSheets<T>, 'mixins'> | null)[]) => {

    return keys.filter($ => $ !== null).join(' ');

}