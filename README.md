# Stylight: simple & reliable CSS-in-JS

A feature-rich CSS-in-JS module, with minimal overhead, designed for better developer experience, granularity and simplicity.

## Features

- [Renders CSS-in-JS into CSS by itself](https://github.com/zelbov/stylight/blob/main/doc/Rendering.md)
- [Selectors nesting](https://github.com/zelbov/stylight/blob/main/doc/Nesting.md)
- [Property overrides](https://github.com/zelbov/stylight/blob/main/doc/Overrides.md)
- [Literal CSS selectors support](https://github.com/zelbov/stylight/blob/main/doc/Literals.md)
- [Isolation, obfuscation and class picking](https://github.com/zelbov/stylight/blob/main/doc/Stylesheets.md)
- [Embeddable into React out of the box](https://github.com/zelbov/stylight/blob/main/doc/React.md)
- [Convenient objects definition hierarchy](https://github.com/zelbov/stylight/blob/main/doc/Hierarchy.md)

## Advantages

- Made with Typescript; type completion friendly
- Zero-dependency: The only dependency is an actual `'csstype'` module which is only a typedef package that does not affect bundle sizes at all.
- Lightweight: minified bundle size is only ![stylight.min.js size](https://img.badgesize.io/https://unpkg.com/stylight@0.5.8/umd/stylight.min.js), React integration plugin is ![stylight.react.min.js size](https://img.badgesize.io/https://unpkg.com/stylight@0.5.8/umd/stylight.react.min.js)
- Great performance. No more IDE lags during typechecks of simple stylings applied

## Installation

### npm

`npm i -S stylight`

This will provide `stylight` core package with plugins included, e.g. `stylight/react`

</br>

### Browser (UMD)

```HTML

<!-- core package -->
<script type="text/javascript" src="https://unpkg.com/stylight@0.5.8/umd/stylight.min.js"></script>
<!-- will provide Stylight UMD global -->

<!-- React plugin -->
<script type="text/javascript" src="https://unpkg.com/stylight@0.5.8/umd/stylight.react.min.js"></script>
<!-- will provide StylightReact UMD global -->


```

</br>

### Requirements

There are two conditional requirements for this package to use.

- `Typescript` >= `4.1` must be used by default for TS server in case of using type completion. A package relies on [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) feature introduced in this version, so earlier versions of Typescript will most likely cause problems. However, for Javascript projects without type completion and type checks both in a project and IDE, no Typescript version requirements are applied.
- In case of using `React`, versions `16` and higher are considered supported since no tests for lower versions has been done. A package relies on React as an optional dependency only, in case React is actually used in a host project

## License

This product is being distributed for free and without any warranty. Copying, redistribution and modification of this code are not subjects to regulations, but including original links to initial version of this product within any redistribution is highly appreciated.

## TODO

- Keyframes documentation
- At-rules (other than just media queries + documentation)
- Render planner documentation
