# Media queries with Stylight

There are two options for media queries to be defined in a stylesheet. First is a `media` keyword, and second is using `atRules`.

This article will explain how to do it the first way.
For the second option, check out documentation page for [AtRules](./AtRules.md).

```JS

// media_query.js

const sheet = {

    foo: {

        media: [{

            "max-width": '800px',

            css: {

                margin: 0

            }

        }]

    }

}

renderStyleSheet(sheet)

/*

(pretty)

@media (max-width:800px) {
    
    .foo {
        
        margin: 0
        
    }
    
}

*/

```

Media queries here defined as a [keyword value](./Hierarchy.md#keyword-value), which is an array of objects of type that is allowed for only media queries.

## Query conditions

A media query object only allows for media query conditions to be defined as top-level properties, and a `css` keyword that contains an actual styling that is being applied to.

Query conditions are declared as raw properties, like `"max-width": '800px'` in example above. Multiple query conditions definition is allowed and will render into a composite query condition, like `"max-width": '800px', "max-height": '400px', css: {...}` will result into `@media (max-height:400px) and (max-width:800px){...css}` accordingly.

Conditions can be declared without value, like `all`, by assigning an empty string as a property value, so `"max-width": '800px', all: '', css: {...}` will result into `@media (all) and (max-width:800px){...css}`.

Query conditions are being alphabetically sorted during render.

## Query CSS

A `css` property of media query object describes a [selector scope](./Hierarchy.md#stylesheet) that will render inside a media query scope in resulting CSS.

E.g. it allows `literals` inside it, that will limit to a media query scope boundaries when rendered, instead of being rendered as top level CSS in a resulting stylesheet, like this:

```JS

// media_literals.js

const sheet = {

    literals: {

        body: {

            marginTop: '0'

        }

    },

    foo: {

        media: [{

            "max-width": '800px',
            "max-height": '400px',

            css: {

                literals: {

                    body: {

                        margin: '0'

                    }

                }

            }

        }]

    }

}

renderStyleSheet(sheet)

/*

(pretty)

body {

    margin-top:0

}

@media (max-width:800px) {
    
    body {
        
        margin:0
        
    }
    
}

*/

```

A media keyword is currently only allowed inside a [selector scope](./Hierarchy.md#selector-scope), which means we still need at least one class element or literal selector scope defined in a stylesheet in order to pass media queries in.

For media queries that cover literal CSS selectors, we can define `literals` scope in a stylesheet or another selector scope, like this:

```JS

// media_literals_only.js

const sheet = {

    literals: {

        body: {

            media: [{

                "max-width": '400px',

                css: {
                    margin: 0
                }

            }],

        },

    }

}

renderStyleSheet(sheet)

/*

(pretty)

@media (max-width:400px) {
    
    body {
        
        margin:0
        
    }
    
}

*/


```
