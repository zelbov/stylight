# Stylesheets in Stylight

## Creating stylesheets and type completion

This package provides all-in-one functional wrapper for stylesheets initialization, rendering and class picking calls using a `createStyleSheet` call.

This allows to use type completion and type checking for stylesheets instantiated in an isolated execution scope:

```JS

import { createStyleSheet, styledClass } from 'stylight'

const { styledClass, render } = createStyleSheet({

    parent: { margin: 0 },
    child: { border: '1px solid #000' }

})

render() // -> ".parent {margin:0}.child {border:1px solid #000}"

// supports type completion for class name picker 
// from stylesheet property names
styledClass('parent') // -> "parent"
styledClass('child') // -> "child"

```

A `styledClass` is a class picker call that will use propery declarations from passed stylesheet objects in order to allow type completions when class names used as property descriptors are passed as parameters.

## Seeding stylesheets

Stylesheets instantiated with `createStyleSheet` call also support seeding, which allows stylesheets to be distinct, isolated, obfuscated, and even all at once:

```JS

import { createStyleSheet, styledClass } from 'stylight'

const { styledClass, render } = createStyleSheet(
    // stylesheet properties
    {

        parent: { margin: 0 },
        child: { border: '1px solid #000' }

    },
    // seed
    'sheet!'
)

render()
/* (pretty) 

"
.c2hlZXQhcGFyZW50 {
    margin: 0;
}

.c2hlZXQhY2hpbGQ= {
    border:1px solid #000;
}
"

*/

styledClass('parent') // -> "c2hlZXQhcGFyZW50"
styledClass('child') // -> "c2hlZXQhY2hpbGQ="

```

A class picker will still use class names declared as property descriptors in parameters, but returned value will be a seeded class name.

By default, seeding algorithm for a passed seed of string type is `btoa(seed+className)`. If you want to use another seeding algorithm, use custom seeding function as a parameter, like this:

```JS

import { createStyleSheet, styledClass } from 'stylight'

const { styledClass, render } = createStyleSheet(
    // stylesheet properties
    {

        parent: { margin: 0 },
        child: { border: '1px solid #000' }

    },
    (className) => className.substring(0, 1)
)

render() // -> ".p {margin:0}.c {border:1px solid #000}"

styledClass('parent') // -> "p"
styledClass('child') // -> "c"

```
