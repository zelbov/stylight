# Literals: applying styles to literally defined selectors instead of just class names

The first and common case of using these is applying CSS rules to `body` or selectors queried by their identifiers (e.g. `#menu`). Sometimes top-level (say global) styling appears multiple times within a sheet and gets conditionally augmented depending on whether a certain UI component has been initialized or not during application load.

This is where `literals` come in:

```JS

// literals.js

import { renderStyleSheet } from 'stylight'

const styles = {
    foo: {
        literals: {
            body: { margin: 'none' }
        }
    }
}

renderStyleSheet(styles)

/*

"body {margin:none}"

*/


```

In this scenario, whenever a UI component that instantiates a stylesheet initializes within a page render process, it applies a styling to a selector that could even not belong to a scope that styles are being applied to.

This allows to augment any predetermined selector styles without traversing all the way to it's initialization boundaries and/or styling scope.

Also, take a look at [nesting](./Nesting.md) documentation page where it is explained how it is possible to define subsequent parent selectors within a CSS rule using a combination with literals.

Literals can also be defined independently in a top-level stylesheet scope, without a need for an actual class selector scope to be present in a stylesheet, like this:

```JS

// literals_top_scope.js

import { renderStyleSheet } from 'stylight'

const styles = {

    literals: {

        body: { margin: 'none' }
    
    }

}

renderStyleSheet(styles)

/*

"body {margin:none}"

*/


```
