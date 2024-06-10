# Property overrides

JS is not meant to have same property descriptor for different properties, but CSS is.
A workaround for this in Stylight is to use `property overrides`:

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

An `overrides` keyword is used within a [selector scope](./Hierarchy.md#selector-scope). It accepts an array of CSS property sets as a value. Multiple CSS properties within a single array item are allowed, which means we can define overrides for multiple different CSS rules within a single CSS rules container as a single array item.
