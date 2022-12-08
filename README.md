# Stylight: simple & reliable CSS-in-JS

## Disclaimer

*As a "little full-stack developer of myself", I am tired of "complete" solutions for web UI development in the wild. If you'll ever need to ask me why I made THIS - you already know the answer.*

## Features & examples

***

### - Renders css-in-js into an actual CSS stylesheet contents, using `'csstype'` compliant css-in-js definitions (`camelCased` style properties e.g. React's CSSProperties)

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

### - Implements nested style properties definition straight in JS style objects hierarchy, applying styles to children by using `'& <child_id>'` (see examples above)

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

### - Implements property overrides for same CSS property for different target renderer platforms

```JS

// gradient.js

import { renderStyleSheet } from 'stylight'

const gradient = {

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

renderStyleSheet(gradient)

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

### - Mixins: applying styles to global object descriptors

```JS

// mixins.js

import { renderMixins } from 'stylight'

const styles = { mixins: { body: { margin: 'none' } } }

renderMixins(styles)

/*

"body {margin:none;}"

*/


```

***

### - Not only rendering: styled class picker from provided styling object

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

### - Integration plugin: React

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


const appInsttance = <App/>

renderToString(appInsttance)

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

## Also

- Made with Typescript, type completion friendly af. You'll like the way it works for you when you define objects, their styles, their children and their styles, and so on, and so on, when you use Typescript type completions.

- *Almost* zero-dependency: The only dependency is an actual `'csstype'` module which is only a typedef package that does not affect bundle size at all.

- Lightweight - minified bundle size is only around 1.5KB, React integration plugin is about 0.5KB of total size.

- Great performance. No more IDE lags during typechecks of simple stylings applied. You know what i mean if you know what i mean.

- Integration plugins out of the box: currently only for React

## TODO

- Media query processing
- Class names transformers for `styledClass` (compression/obfuscation support)
- Installation instructions
