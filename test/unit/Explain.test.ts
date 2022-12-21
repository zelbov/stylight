import { expect } from 'chai'
import 'mocha'
import { explainStyleSheet, renderExplained } from 'stylight'

describe('Explainer unit tests', () => {

    describe('Simple styling planning & rendering', () => {

        const explain = explainStyleSheet({

            menu: {
                border: '1px solid #000'
            }

        })
    
        it('Explain styling object render plan: should consist of valid render context tree', () => {
    
            expect(explain.tgs['.menu']).not.undefined
            expect(explain.tgs['.menu'].css).not.undefined
            expect(explain.tgs['.menu'].css).contain('border:1px solid #000')
    
        })
    
        it('Render stylesheet according to explained plan: should succeed & return valid CSS', () => {
    
            const css = renderExplained(explain)
    
            console.log(css)

            expect(css).contain('.menu {border:1px solid #000;}')
    
        })

    })

    describe('Nested styles planning & rendering', () => {

        const explain = explainStyleSheet({

            menu: {

                border: '1px solid #000',

                '& div': {

                    background: 'red'

                },

                '&.blue': {

                    background: 'blue'

                }

            }

        })

        it('Explain nested styling object render plan: should consist of valid render context tree', () => {

            expect(explain.tgs['.menu']).not.undefined
            expect(explain.tgs['.menu'].cs).eq('.menu')

            expect(explain.tgs['.menu'].tgs[' div']).not.undefined
            expect(explain.tgs['.menu'].tgs[' div'].cs).eq(' div')

            expect(explain.tgs['.menu'].tgs['.blue']).not.undefined
            expect(explain.tgs['.menu'].tgs['.blue'].cs).eq('.blue')

        })
        it('Render stylesheet containing nested styles: should succeed & return valid CSS', () => {

            const css = renderExplained(explain)

            console.log(css)

            expect(css).contain('.menu {border:1px solid #000;}')
            expect(css).contain('.menu div {background:red;}')
            expect(css).contain('.menu.blue {background:blue;}')

        })

    })

    describe('Overrides planning & rendering', () => {

        const explain = explainStyleSheet({

            menu: {

                overrides: [{
                    background: '#fff'
                }, {
                    background: '#000'
                }]

            }

        })

        it('Explain overrides render plan: should consis of valid render context tree', () => {

            expect(explain.tgs['.menu'].css!.length).eq(2)
            expect(explain.tgs['.menu'].css![0]).eq('background:#fff')
            expect(explain.tgs['.menu'].css![1]).eq('background:#000')

        })

        it('Render overrides according to explained plan: should succeed & return valid CSS', () => {

            const css = renderExplained(explain)

            console.log(css)

            expect(css).contain('.menu {background:#fff;background:#000;}')

        })

    })

    describe('Mixins definition planning & rendering', () => {

        const explain = explainStyleSheet({

            mixins: {

                body: {

                    margin: '0'

                },

                a: { textDecoration: 'none' }

            }

        })

        it('Explain mixins render plan: should consist of valid render context tree', () => {

            expect(explain.tgs['body'].type).eq('mixins')
            expect(explain.tgs['a'].type).eq('mixins')
            
        })

        it('Render stylesheet containing mixins: should succeed & return valid CSS', () => {

            const css = renderExplained(explain)

            console.log(css)

            expect(css).contain('body {margin:0;}').and.not.contain('.body')
            expect(css).contain('a {text-decoration:none;}').and.not.contain('.a')

        })

        const explainNested = explainStyleSheet({

            menu: {

                border: 'none',

                mixins: {

                    body: { margin: '0' }

                },

                '& a': {

                    border: '1px solid #000',

                    mixins: {

                        a: { textDecoration: 'none' }

                    }
                    
                }

            }
        })

        it('Explain nested mixins render plan', () => {

            expect(explain.tgs['body'].type).eq('mixins')
            expect(explain.tgs['a'].type).eq('mixins')

        })

        it('Render stylesheets with nested mixins', () => {

            const css = renderExplained(explainNested)

            console.log(css)

            expect(css).contain('.menu {border:none;}')
            expect(css).contain('.menu a {border:1px solid #000;}')
            expect(css).contain('body {margin:0;}').and.not.contain('.body')
            expect(css).contain('a {text-decoration:none;}').and.not.contain('.a')

        })

    })

    describe('At-Rules planning & rendering', () => {

        const explain = explainStyleSheet({

            atRules: ['@import (...font)']

        })

        it('Explain at-rules render plan: should consist of valid rener context tree', () => {

            console.log(explain)

            expect(explain.css).not.undefined
            expect(explain.css).contain('@import (...font)')

        })

        it('Render stylesheet containing at-rules: should succeed & return valid CSS', () => {

            const css = renderExplained(explain)

            console.log(css)

            expect(css).eq('@import (...font);')

        })

    })

    describe('Media queries planning & rendering', () => {

        const explain = explainStyleSheet({

            menu: {

                width: '600px',

                media: [
                    
                    { "max-width": '1280px', css: { width: '400px' } }

                ]

            },

        })

        it('Explain media queries render plan: should consist of valid render context tree', () => {

            expect(explain.tgs['@media (max-width:1280px)'].tgs['.menu']).not.undefined
            
        })

        it('Render stylesheet containing media queries: should succeed & return valid CSS', () => {

            const css = renderExplained(explain)

            console.log(css)

            expect(css).contain('.menu {width:600px;}')
            expect(css).contain('@media (max-width:1280px){.menu {width:400px;}}')

        })

        const explainNested = explainStyleSheet({

            menu: {

                width: '600px',

                media: [
                    
                    { "max-width": '1280px', css: { width: '400px' } }
                ],

                '& div': {

                    position: 'relative',

                    media: [

                        { "max-width": '1280px', css: { position: 'absolute' } }

                    ]

                }

            },

        })

        it('Explain media queries inside nested targets', () => {

            const mediaTargets = explainNested.tgs['@media (max-width:1280px)']

            expect(mediaTargets).not.undefined
            
            expect(mediaTargets.tgs['.menu']).not.undefined
            expect(mediaTargets.tgs['.menu div']).not.undefined

            expect(mediaTargets.tgs['.menu'].css!.length).eq(1)
            expect(mediaTargets.tgs['.menu div'].css!.length).eq(1)

        })

        it('Render media queries inside nested targets', () => {

            const css = renderExplained(explainNested)

            console.log(css)

            expect(css).contain('.menu {width:600px;}')
            expect(css).contain('.menu div {position:relative;}')
            expect(css).contain('@media (max-width:1280px){.menu {width:400px;}.menu div {position:absolute;}}')

        })

    })

})