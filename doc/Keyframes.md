# Keyframes in Stylight

Same as media queries, keyframes can be defined in two ways: either as a keyword within a selector scope, or [AtRule](./AtRules.md).

This article will explain how to define keyframes as a keyword.

```JS

// keyframes.js

const sheet = {

    foo: {

        animationName: 'animateFoo',
        animationDuration: '.5s',

        keyframes: [{

            name: 'animateFoo',
            steps: [{
                from: { background: '#fff' },
                to: { background: '#000' }
            }]

        }],

    }

}

renderStyleSheet(sheet)

/*

(pretty)

@keyframes animateFoo {

    from { background: #fff }
    to { background: #000 }

}

.foo {

    animation-name: animateFoo;
    animation-duration: .5s

}

*/

```

A `keyframes` keyword is only allowed within a [selector scope](./Hierarchy.md#selector-scope) and accepts an array of objects that describe keyframes scope.

Keyframes scope only allows two properties, `name` and `steps`, where `name` is passed to `@keyframes name` in resulting CSS, while `steps` accept an array of objects that define styling for various steps of an animation.

An object that is passed into array as `steps` property value can contain one two variants of property sets:

- `from` and `to` properties which both accept CSS properties containers as values
- `percentage` property which is a number from 0 to 100 and `css` property that contains styling for an animation step

Example of using `percentage`:

```JS

// keyframes_percentage.js

const sheet = {

    foo: {

        animationName: 'animateFoo',
        animationDuration: '.5s',

        keyframes: [{

            name: 'animateFoo',
            steps: [{
                percentage: '25',
                css: {
                    background: '#00aaff'
                }
            }, {
                percentage: '50',
                css: {
                    background: '#00aa00'
                }
            }]

        }],

    }

}

renderStyleSheet(sheet)

/*

(pretty)

@keyframes animateFoo {

    25% { background: #fff }
    50% { background: #000 }

}

.foo {

    animation-name: animateFoo;
    animation-duration: .5s

}

*/


```
