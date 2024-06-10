# Hierarchy and conventions of CSS-in-JS definitions supported by Stylight

There are several features besides classical CSS-in-JS introduced with this package, but they also imply following specific conventional rules and abstract definitions.

## Stylesheet

### A top-level definition of CSS-in-JS object is a `stylesheet`. The only thing that can be rendered by a built-in renderer is a stylesheet

Passing it's inner contents into renderer is not supported and will most likely break during render planning or render execution.

Typechecking and type completions are also expected to consecutively fail when this is violated somehow.

```JS

// stylesheets.js

const sheet = {

    // this is a stylesheet

    menu: { margin: '0' }

}

renderStyleSheet(sheet) // allowed

const not_a_sheet = {
    
    // this is NOT a stylesheet. it is a CSS properties container

    margin: 0
    
}

renderStyleSheet(not_a_sheet) // will fail


```

## Stylesheet properties

### Every top-level property descriptor of defined stylesheet represents either a class name, or a keyword

Nesting, CSS property definitions and other things besides class names and some keywords are not allowed at a top level stylesheet definition. They will produce type errors in case of using type checking, and either will not be included in render planner, or produce artifacts, or even break renderer execution. Further updates targeted on explicitly disallowing them during actual code execution will most likely never appear, for optimization reasons.

## Keywords

### Every property descriptor that is not a functional keyword (further - `keyword`) is either a class name, a nesting target, or a CSS property

Examples of keywords are [`literals`](./Literals.md), [`media`](./MediaQueries.md), [`overrides`](./Overrides.md), [`keyframes`](./Keyframes.md) and [`atRules`](./AtRules.md).

```JS
// keywords.js

const sheet = {

    foo /*is a class name here*/: {
        margin /*is a CSS property here*/: '0',
        overrides /*is a keyword here*/: [],
        '& div' /*is a nesting target here*/: {}
    },
    literals /*is a keyword here*/: {}

}

```

Currently only one keyword that is allowed at a top level of a stylesheet is `literals`. Others are only allowed inside a selector scope.

## Selector scope

### An object passed as a property value described by a selector (class name or nested target) is a selector scope

A selector scope is mainly a container for CSS properties definitions, but also allows nesting and keywords declarations.

Selector scopes are allowed to be empty, but not recommended in any scenario except for programmatically generated CSS instead of explicitly defined. However, support for generated scopes will probably never be provided and/or tested.

Objects that are defined as values to nested target property descriptors are also selector scopes.

```JS

// selector_scope.js

const sheet = {

    foo: {

        // this is a selector scope for ".foo" class selector

        '& div': {

            // this is a nested target scope, which is also a selector scope

        }

    }

}

```

## Keyword scope

### An object passed as a value described by a keyword is a keyword scope. A value type other than an object passed to keyword property is a keyword value

Currently an only available keyword scope is `literals` scope, since it accepts a single object as a value, while other keywords are used declare primitives, arrays of primitives, or arrays of other objects.

```JS

// keywords.js

const sheet = {

    foo: {
        margin: '0' /* is a CSS property value here*/,
        overrides: [] /*is a keyword value here*/,
        '& div': {/*is a nesting target scope, thus, selector scope here*/} 
    },
    literals: {/*is a keyword scope here*/}

}

```

Keyword scopes have a common rule: they can not and should not be chained/recursive. Even if you manage to get it to work somehow, they should not.

A renderer will most likely not receive any update that is explicitly targeted to prevent this during execution for optimization reasons, but in most cases this will at least break on type check. Neither there will be any support provided to allow this.

For example, a keyword scope defined for `literals` cannot have `literals` property, neither nested targets defined within it can have it, like this:

```JS

// chained_keywords.js

const sheet = createStyleSheet({

    menu: {

        literals: {

            literals /*typecheck will break here since it's not allowed*/: {}

            body: {

                literals /*typecheck will break here since it's not allowed*/: {

                    body: { margin: 0 }

                }

            },

            '&h1': {

                literals /*typecheck will break here since it's not allowed*/: {

                    body: { margin: 0 }

                }

            },

        }

    }

})

```

## Keyword value

There are no strict common rules applied to value format for all keyword values supported, rather every keyword that defines a value can have it's own value format.

For example, `media` keyword accepts array of objects of type `[{[mediarule: string]: {...stylesheet}}]`.
