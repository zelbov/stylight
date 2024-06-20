# Embedding Stylight into React

React interopability is provided by this package out of the box, with a sufficient set of hooks and providers available.
However, it is only included in a Node.js package by default. For external installation on web pages, see [front page](../README.md#installation) for instructions on how to install a React plugin.

Other web development frameworks such as Angular or Vue will most likely not officially be supported by this package, but distribution of third party plugins that will provide this kind of support is highly appreciated.

## Basic usage

```JSX

// react_basic.jsx

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


    // supports class names type completion in case of using a hook
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

## useStyle hook

Basically `useStyle` hook is a React-oriented version of [`createStyleSheet`](./Stylesheets.md#creating-stylesheets-and-type-completion) call, but only returns a class picker with type completion support. Styles composition and rendering are handled by top-level rendering context and a renderer component `StyleRenderer`.

Also, stylesheets passed into rendering context with this call are assigned with their unique identifiers in a list, and support automatic correction of a styles tree in case of using hydration and frequent/eventual re-renders (e.g. when combined with Helmet, React.lazy or implementation of theme switches).

A retuned class picker accepts multiple parameters of string type, implying that an actual element could contain multiple class names, and typechecking of passed parameters is not strictly limited to property descriptors used in a stylesheet.

This allows using arbitrary class names, conditional class names (`null` and `undefined` are allowed too), and even inheritance of class names from parent components, like this:

```JS

// react_use_style.jsx

import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Styled, StyleRenderer, useStyle } from 'stylight/react'
import { renderToString } from 'react-dom/server'

const StyledParent = () => {

    const styled = useStyle({
        inheritedParentStyles: { margin: 0 }
    })

    return <StyledChild className={
        // type completion is supported here
        styled('inheritedParentStyles')
    }/>

}

let idx = 0

const StyledChild = (props) => {

    const styled = useStyle({
        child: { border: '1px solid #000' }
    })

    return <div {...props} className={
        
        styled(
            // type completion is supported for 'child' parameter value, 
            'child',
            // but inheriting class names from higher level components is also allowed
            props.className,
            // arbitrary strings, conditional strings and nullish values are also allowed
            idx++ % 2 ? 'odd' : null
        )
    }></div>
    
}

const App = () => <Styled>

    <StyledParent/>

    <StyleRenderer/>

</Styled>

renderToString(<App/>)

/*

(pretty)

<div class="child inheritedParentStyles"></div>
<style type="text/css" data-uid="0">
    .inheritedParentStyles {margin:0}
    .child {border:1px solid #000}
</style>

*/

```

This hook also accepts a second `options` parameter as an object with following properties:

- [`seed`](./Stylesheets.md#seeding-stylesheets): provide a seed for class selector
- `mutate`: define a condition by which an asynchronously loaded stylesheet will mutate.

By default, all stylesheets defined within a component tree using `useStyle` hook are immutable, which means they will never get updated upon styled component re-render, unless a mutation condition is explicitly defined. This allows for implementation of conditional theme switches, while at the same reduces performance overhead during hydration when it is not necessary:
_TBD: code sample_

Styles that were initially rendered by `StyleRenderer` during first (synchronous) page render will never mutate at their place. Instead, mutations of those styles will be performed by duplicating them and appending as overrides. This is due to first page render composes all styles used in a synchronously rendered tree into a single styles container within a single `<style>` tag, while asynchronously rendered or mutated styles are passed into their own distinct tags, and so they can be mutated separately without re-rendering a whole set of all styles that were ever detected during application renders.

However, multiple mutations of the same stylesheet will not produce duplicate distinct styles in a DOM tree, instead it will mutate the same distinct style tag related to same stylesheet definition in within a component. Same applies to styles instantiated within asynchronously rendered components.

## Helmet

It is possible to pass contents produced by `StyleRenderer` into `Helmet` using `wrap` property of a `StyleRenderer` component:

```JS

// react_helmet_server.jsx

import React from 'react'
import { Styled, StyleRenderer, useStyle } from 'stylight/react'
import { Helmet } from 'react-helmet'
import { renderToString } from 'react-dom/server'

const StyledComponent = () => {

    const styled = useStyle({
        obj: { border: '1px solid #000' }
    })

    return <div className={styled('obj')}></div>

}

const App = () => <Styled>

    <Helmet title='Helmet Test'/>

    <StyledComponent/>

    <StyleRenderer wrap={ (styleTags) => <Helmet>{styleTags}</Helmet> }/>

</Styled>

renderToString(<App/>) /* <div class="obj"></div> */

const helmet = Helmet.renderStatic()

helmet.title.toString()
/* <title data-react-helmet="true">Helmet Test #2</title> */

helmet.style.toString()
/*

(pretty)
<style data-react-helmet="true" type="text/css" data-uid="0">
    .obj {border:1px solid #000}
</style>

*/

```

The above code is provided as example of usage with server-side rendering, while in browser all the rendering, as well as duplicate asynchronous styles appearance prevention will be handled properly by `ReactDOM.hydrate`:

```JS

// react_helmet_hydrate.jsx

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Styled, StyleRenderer, useStyle } from 'stylight/react'

const StyledComponent = () => {

    const styled = useStyle({
        obj: { border: '1px solid #000' }
    })

    const [state, setState] = useState(0)

    useEffect(() => {
        // initiate state update once more
        if(state == 0) setState(1)
    })

    return <div className={styled('obj')}>{
        // render asynchronously initialized component at second render
        state == 1 ? <AsyncComponent/> : null
    }</div>

}

const AsyncComponent = () => {

    const styled = useStyle({
        obj2: { border: 'none' }
    })

    return <div className={styled('obj2')}></div>

}

const App = () => <Styled>

    <Helmet title='Helmet Test'/>

    <StyledComponent/>

    <StyleRenderer wrap={ (styleTags) => <Helmet>{styleTags}</Helmet> }/>

</Styled>

ReactDOM.hydrate(
    <App/>,
    document.getElementById('root')
)


/*

will produce the following (pretty):

...
<head>

    <title>Helmet Test</title>
    <style type="text/css" data-uid="0" data-react-helmet="true">.obj {border:1px solid #000}</style>
    <style data-uid="1">.obj2 {border:none}</style>

</head>

<body>

    <div id="root"><div class="obj"><div class="obj2"></div></div></div>

...

*/


```

As we can see here, no additional workarounds for asynchrounous styled components rendering required when using `StyleRenderer` component out of the box.

## StyleRenderer explained

Every stylesheet passed to `useStyle` hook will be rendered into CSS inliner wrapped with `<style>` tag using `<StyleRenderer/>` component.
A render process is synchronous and is called over those stylesheets that were already instantiated within previously rendered nodes.

However, in a browser, when styles are being added asynchrounously after first page render (e.g. conditionally, depending on state values changed on state update, or using `React.lazy`, or `useEffect`), a renderer will accept them and append them to the queue of rendered styles if they do not belong to any components that were previously requested to render their styles already. They will also appear after initial `<style>` tag produced by first render wrapped within their own `<style>` tags each, and have `data-uid` property assigned to each tag, identifying them among other styles and excluding from further duplication upon re-render.

For example, if we update a state of a component that has an unconditional styling applied with `useStyle` hook, a renderer will not produce a duplicate of this stylesheet. This is achieved by `StyleRenderingContext` internal listener's behaviour by default. This does not work with `react-dom/server` though, as it will still produce duplicate styles if a page instance is being rendered multiple times.

When styles are generated conditionally, they will be replaced within a style rendering area accordingly. This allows using theme switches:
_TBD: code sample_

## StyleRendererContext explained

A `Styled` React component is basically a shorthand to a style rendering context, which can be also explicitly defined like this: `<StyleRenderingContext.Provider value={createStyleRenderingContext()}>`.

A rendering context is a listener for Stylight [stylesheets](./Hierarchy.md#stylesheet) passed into it using `useStyle` hook call.
This context's value is not mutated by updates it receives by a hook and will never trigger a page re-render. Instead, every stylesheet is being pushed into internal storage of a listener accessible as a context target, like this:

```JSX

// react_context.jsx

import { renderToString } from 'react-dom/server'
import {

    Styled,
    StyleRenderer,
    StyleRenderingContext,
    useStyle

} from 'stylight/react'

const Component = () => {

    const styled = useStyle({

        foo: { margin: 0 }

    })

    const context = useContext(StyleRenderingContext)

    if(!context) return null;

    return <div className={styled('foo')}>
        {context.target.sources.length /*total stylesheets amount stored in a context*/}
    </div>

}

const App = () => <Styled>

    <Component/>

    <StyleRenderer/>

</Styled>

renderToString(<App/>)

/*

(pretty)

"
<div class="obj">1</div>
<style>
    .foo {margin:0}
</style>
"

*/


```

A `context.target` here is an extended `EventTarget` that contains list of stylesheets and their corresponded seeding processors collected through a whole node tree within all components that used `useStyle` hook. Additional listeners can be applied to it in order to perform intermediate operations over stylesheet objects defined, e.g. updating custom renderers state instead of using a built-in renderer component.
