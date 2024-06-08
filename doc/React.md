# Embedding Stylight into React

React interopability is provided by this package out of the box, with a sufficient set of hooks and providers available.
However, it is only included in a Node.js package by default. For external installation for web pages, see [front page](../README.md) for instructions on how to install a React plugin.

Other web development frameworks such as Angular or Vue will most likely not officially be supported by this package itself, but distribution of third party plugins that will provide this kind of support is highly appreciated.

Basic usage (shorthand):

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
