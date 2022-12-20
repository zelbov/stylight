# Stylight: simple & reliable CSS-in-JS

A feature-rich CSS-in-JS module for web UI development, with minimal overhead, designed for better developer experience, granularity and simplicity.

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

".menu {border-bottom:1px solid #000;}"

*/
```

***
</br>

- Nested style properties definition straight in JS style objects hierarchy, applying styles to children by using `'& <child_id>'` (see examples above)

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
.menu {border:1px solid #000;}
.menu div {background-color:red;}
"

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

- Mixins: applying styles to global object descriptors

```JS

// mixins.js

import { renderStyleSheet } from 'stylight'

const styles = {
    foo: {
        mixins: {
            body: { margin: 'none' }
        }
    }
}

renderStyleSheet(styles)

/*

"body {margin:none;}"

*/


```

***
</br>

- Not only rendering: styled class picker from provided styling object

```TS

// styled_class.ts

import { styledClass } from 'stylight'

const styles = { menu: { margin: 'none' } }

// if using Typescript, for autocompletion support of class names, styling object type must be provided as generic type parameter

styledClass<typeof styles>(
    'menu',
    // null values are accepted in case when we need to apply class names conditionally, e.g. `row % 2 ? 'odd' : null`
    null
)

/*

"menu"

*/
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
    StyleRenderer

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
    .obj {border:1px solid #000;}
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
    .obj {border:1px solid #000;}
</style>
"

*/


```

***
</br>

## Also

- Made with Typescript, type completion friendly. You'll like the way it works for you when you define objects, their styles, their children and their styles, and so on, and so on.

- *Almost* zero-dependency: The only dependency is an actual `'csstype'` module which is only a typedef package that does not affect bundle sizes at all.

- Lightweight - minified bundle size is only around 2KB, React integration plugin is also about 2KB of total size.

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
<script type="text/javascript" src="https://unpkg.com/stylight/umd/stylight.min.js"></script>
<!-- will provide Stylight UMD global -->

<!-- React plugin -->
<script type="text/javascript" src="https://unpkg.com/stylight/umd/stylight.react.min.js"></script>
<!-- will provide StylightReact UMD global -->


```

</br>

### Requirements

There are two conditional requirements for this package to use.

- `Typescript` >= `4.1` must be used as default TS server in case of using type completions, and installed as a [dev]dependency for Typescript projects aswell. A package uses [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) feature introduced in this version, so earlier versions of Typescript used will most likely cause problems. However, for Javascript projects without type completions both in a project and IDE, no Typescript version requirements are applied.
- In case of using `React`, versions `16` and higher are considered supported since no tests for lower versions are done. A package relies on React as an optional dependency only, in case React is actually used in a host project

## TODO (planned for future releases)

- Media queries (DOC)
- At-rules (others aside of media queries)
- Class names transformers for `styledClass` (compression/obfuscation for rendered class names)

## Known bugs / issues

- Mixins are sometimes rendered outside their initial media query scope
