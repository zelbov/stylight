# Stylight: simple & reliable CSS-in-JS

A feature-rich CSS-in-JS module, with minimal overhead, designed for better developer experience, granularity and simplicity.

## Features and examples

***
</br>

- Renders css-in-js into an actual CSS stylesheet contents, using `'csstype'` compliant css-in-js definitions (`camelCased` style properties, e.g. React's `CSSProperties`)

```JS

// styles.js

import { renderStyleSheet } from 'stylight'

const styles = { menu: { borderBottom: '1px solid #000' } }

renderStyleSheet(styles)

/*

".menu {border-bottom:1px solid #000}"

*/
```

***
</br>

- Nested style properties definition straight in JS style objects hierarchy, applying styles to children by using `'& <child_id>'` (see example below)

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

"
.menu {border:1px solid #000}
.menu div {background-color:red}
"

*/

```

***
</br>

- Repeating nested style selector in a property descriptor is also supported:

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

***
</br>

- Property overrides for same CSS property for different target renderer platforms

```JS

// gradient.js

import { renderStyleSheet } from 'stylight'

const styles = {

    gradient: {

        // msie
        filter:
        'progid:DXImageTransform.Microsoft.gradient(startColorstr="#23553f",endColorstr="#041316",GradientType=1)',
    
        // overriding same property more than once:
        overrides: [
            
            {
                // fallback (no gradient support)
                background: 'rgb(35,85,63)'
            },
            {
                // moz
                background:
                '-moz-linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%)'
            },
            {
                // webkit
                background:
                '-webkit-linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%)'
            },
            {
                // common
                background:
                'linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%)'
            },
            
        ],

    }

}

renderStyleSheet(styles)

/*

(pretty)

".gradient {
    
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#23553f",endColorstr="#041316",GradientType=1);
    
    background:rgb(35,85,63);
    
    background:-moz-linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%);
    
    background:-webkit-linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%);
    
    background:linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%);
    
}"

*/

```

***
</br>

- Literals: applying styles to top-level object descriptors instead of just class names

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

***
</br>

- Literals can be also combined with selectors nesting to use a nested target as a succeeding selector part, like this:

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

***
</br>

- Stylesheets: easily created, efficiently isolated, type completion for class name picker included!

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

***
</br>

- Stylesheets also support seeding to identify, isolate, obfuscate, compress class names, or even all at once!

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

    // by default, seeding algorithm for a seed of string type is `btoa(seed+className)`
    // if you want to apply another algorithm, see custom seeding callback implementation example below
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

***
</br>

- Seeding with a custom class name transform function

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

***
</br>

- Integration plugin: React

Basic usage (shorthand)

```JSX

import { renderToString } from 'react-dom/server'

import {

    // A shorthand to provide top-level style rendering context wrap
    Styled,

    // Renderer component for all received style objects during render of previous components that used `useStyle` hook
    StyleRenderer,

    // An actual hook that pushes defined styling objects into top-level context provider
    useStyle

} from 'stylight/react'

// A React component that uses styling hook
const Component = () => {

    // pass individual component's styling into top-level theme provider
    const styled = useStyle({
        obj: { border: '1px solid #000' }
    })


    // supports class names type autocompletion on-the-fly in case of using a hook
    return <div className={
        styled('obj')
    }></div>

}

// Host application that uses style rendering context
const App = () => <Styled>

    {/* Render component that uses styling hook*/}
    <Component/>

    {/* Use the actual renderer on the end of node tree in case we need to synchronously render styles without waiting for next state update & re-render */}
    <StyleRenderer/>

</Styled>

renderToString(<App/>)

/*

(pretty)

"
<div class="obj"></div>
<style>
    .obj {border:1px solid #000}
</style>
"

*/

```

Extended usage (exposed context):

```JSX

// react_sample.jsx

import { renderToString } from 'react-dom/server'
import {

    // Creates styles appearance listener instance for styling context provider
    createStyleRenderingContext,

    // Renderer component for all received style objects during render of previous components that used `useStyle` hook
    StyleRenderer,
    
    // A top-level context that provides node tree with access to style appearance listener
    StyleRenderingContext,
    
    // An actual hook that pushes defined styling objects into top-level context provider
    useStyle

} from 'stylight/react'

// A React component that uses styling hook
const StyledComponent = () => {

    // pass individual component's styling into top-level theme provider
    const styled = useStyle({
        obj: { border: '1px solid #000' }
    })


    // supports class names type autocompletion on-the-fly in case of using a hook
    return <div className={
        styled('obj')
    }></div>

}

// Host application that uses style rendering context
const App = () =>

// Create style rendering context provider with an isolated instance of listener
<StyleRenderingContext.Provider value={createStyleRenderingContext()}>
    
    {/* Render component that uses styling hook*/}
    <StyledComponent/>
    
    {/* Use the actual renderer on the end of node tree in case we need to synchronously render styles without waiting for next state update & re-render */}
    <StyleRenderer/>

</StyleRenderingContext.Provider>

renderToString(<App/>)

/*

(pretty)

"
<div class="obj"></div>
<style>
    .obj {border:1px solid #000}
</style>
"

*/


```

***
</br>

## Also

- Made with Typescript, TOTALLY type completion friendly!

- *Almost* zero-dependency: The only dependency is an actual `'csstype'` module which is only a typedef package that does not affect bundle sizes at all.

- Lightweight - minified bundle size is only around 4.4 KB, React integration plugin is about 2.5 KB of additional size.

- Great performance. No more IDE lags during typechecks of simple stylings applied. You know what I mean if you know what I mean.

- Integration plugins out of the box: currently only for React

***
</br>

## Installation

</br>

### npm

`npm i -S stylight`

This will provide `stylight` core package with plugins included, e.g. `stylight/react`

</br>

### Browser (UMD)

```HTML

<!-- core package -->
<script type="text/javascript" src="https://unpkg.com/stylight@0.5.6/umd/stylight.min.js"></script>
<!-- will provide Stylight UMD global -->

<!-- React plugin -->
<script type="text/javascript" src="https://unpkg.com/stylight@0.5.6/umd/stylight.react.min.js"></script>
<!-- will provide StylightReact UMD global -->


```

</br>

### Requirements

There are two conditional requirements for this package to use.

- `Typescript` >= `4.1` must be used as default TS server in case of using type completions, and installed as a [dev]dependency for Typescript projects aswell. A package uses [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) feature introduced in this version, so earlier versions of Typescript used will most likely cause problems. However, for Javascript projects without type completions both in a project and IDE, no Typescript version requirements are applied.
- In case of using `React`, versions `16` and higher are considered supported since no tests for lower versions are done. A package relies on React as an optional dependency only, in case React is actually used in a host project

## TODO

- Media queries (DOC)
- At-rules (other than just media queries)
