# Stylight: simple & reliable CSS-in-JS

A feature-rich CSS-in-JS module, with minimal overhead, designed for better developer experience, granularity and simplicity.

## Features

- [Renders CSS-in-JS into CSS by itself](doc/Rendering.md)
- [Selectors nesting](doc/Nesting.md)
- [Property overrides](doc/Overrides.md)
- [Literal CSS selectors support](doc/Literals.md)
- [Isolation, obfuscation and class picking](doc/Stylesheets.md)
- [Embeddable into React out of the box](doc/React.md)
- [Convenient objects definition hierarchy](doc/Hierarchy.md)

## Advantages

- Made with Typescript; type completion friendly

- Zero-dependency: The only dependency is an actual `'csstype'` module which is only a typedef package that does not affect bundle sizes at all.

- Lightweight: minified bundle size is only around 4.4 KB, React integration plugin is about 2.5 KB of additional size.

- Great performance. No more IDE lags during typechecks of simple stylings applied

## Installation

### npm

`npm i -S stylight`

This will provide `stylight` core package with plugins included, e.g. `stylight/react`

</br>

### Browser (UMD)

```HTML

<!-- core package -->
<script type="text/javascript" src="https://unpkg.com/stylight@0.5.7/umd/stylight.min.js"></script>
<!-- will provide Stylight UMD global -->

<!-- React plugin -->
<script type="text/javascript" src="https://unpkg.com/stylight@0.5.7/umd/stylight.react.min.js"></script>
<!-- will provide StylightReact UMD global -->


```

</br>

### Requirements

There are two conditional requirements for this package to use.

- `Typescript` >= `4.1` must be used by default for TS server in case of using type completion. A package reliaes upon [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) feature introduced in this version, so earlier versions of Typescript will most likely cause problems. However, for Javascript projects without type completion and type checks both in a project and IDE, no Typescript version requirements are applied.
- In case of using `React`, versions `16` and higher are considered supported since no tests for lower versions has been done. A package relies on React as an optional dependency only, in case React is actually used in a host project

## TODO

- Media queries ducomentation
- Keyframes documentation
- At-rules (other than just media queries + documentation)
- Render planner documentation
