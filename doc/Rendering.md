# CSS rendering with Stylight

This module supports CSS rendering out of the box, without any additional dependencies or plugins required. Neither it relies on or can switch to other renderers from other packages.

A stylesheet output from renderer does not prettify an output, instead it always produces optimized CSS inliner. To prettify your rendered CSS, you should consider using other external packages like `prettier`

To render a CSS-in-JS object into CSS stylesheet, we need to define it as one that complies with [`csstype`](https://www.npmjs.com/package/csstype) type definition (similar to what React's `style` property of a component does) and pass it to `renderStyleSheet` function.

Unlike `style` property of a React component, however, a provided object's top-level structure must be `{ className: {...properties}, ... }` instead of just a container of CSS properties. See example below:

```JS

// styles.js

import { renderStyleSheet } from 'stylight'

const styles = { menu: { borderBottom: '1px solid #000' } }

renderStyleSheet(styles)

/*

".menu {border-bottom:1px solid #000}"

*/
```

However, not only class names are used as property descriptors on a top level. There are few reserved keywords that are not allowed as class names, like `literals`, `media`, `keyframes`, `atRules` and `overrides`.
See documentation for usage the above keywords:

- [Literals](./Literals.md)
- [Media queries](./MediaQueries.md)
- [Keyframes](./Keyframes.md)
- [AtRules](./AtRules.md)
- [CSS Property Overrides](./Overrides.md)

Besides using only CSS properties definitions in a [selector scope](./Hierarchy.md), there is also recursive selectors support, quite similar to SCSS but in JS.

See documentation for [nesting](./Nesting.md) to learn more about it.

Keywords that are mentioned above are also applicable for actual style properties container besides just CSS properties definitions.
It is highly recommended to see docs about [Hierarchy](./Hierarchy.md) to learn more from what's allowed and what's not.
