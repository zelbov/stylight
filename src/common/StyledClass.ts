import { StyleSheetObject } from "./SheetTypings";


export const styledClass = <T extends Object>(...keys: (keyof Omit<StyleSheetObject<T>, 'literals'> | null | undefined | String)[]) => {

    return keys.filter($ => $ !== null && $ !== undefined).join(' ');

}
