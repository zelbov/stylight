# CSS Selectors nesting with Stylight

Similarly to SCSS syntax, Stylight supports nested selectors in stylesheet definitions. There is a control symbol (`&`) allowed in property descriptors that is replaced with a declaration of a parent selector whenever a stylesheet is processed by renderer. See example below:

```JS

// nested_styles.js

import { renderStyleSheet } from 'stylight'

const styles = {
    menu: {
        border: '1px solid #000',
        '& div': {
            backgroundColor: 'red'
        }
    }
}

renderStyleSheet(styles)

/*

(pretty)

.menu {border:1px solid #000}
.menu div {background-color:red}

*/

```

Thus, every property descriptor that is being declared inside any selector scope thats has this control symbol is being replaced by a selector that is represented by parent descriptor.
See [hierarchy](./Hierarchy.md) documentation page for more information about scopes and their definition rules.

Also, nesting property descriptor can contain multiple instances of a control symbol that represents a parent selector, like this:

```JS

// nested_multi.js

import { renderStyleSheet } from 'stylight'

const styles = {
    foo: {
        '& h1, & h2': {
            fontSize: '16px'
        }
    }
}

renderStyleSheet(styles)

/*

".foo h1, .foo h2 {font-size:16px}"

*/

```

Nesting is only allowed within a [selector scope](./Hierarchy.md#selector-scope). Trying to define in in a [stylesheet scope](./Hierarchy.md#stylesheet) will result in type error and will either not be included in rendered CSS or produce artifacts.

Also, nesting target declared as property descriptor within a class selector scope should always start with a `&`. For other scenarios like subsequent parent selectors, see example below.

## Nesting with literals

Nesting can also be used to pass parent selector as subsequent one. This is achievable by combining a nesting feature with [Literals](./Literals.md):

```JS

// nested_literals.js

import { renderStyleSheet } from 'stylight'

const styles = {
    foo: {
        literals: {
            'h1&, h2&': {
                fontSize: '16px'
            }
        }
    }
}

renderStyleSheet(styles)

/*

"h1.foo, h2.foo {font-size:16px}"

*/


```
