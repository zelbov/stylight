import { expect } from 'chai'
import 'mocha'
import { createStyleSheet } from 'stylight'

describe('Keyframes rule unit testing', () => {

    describe('Selector-scoped keyframes', () => {

        it('Define keyframes rule with from/to: should pass typechecks & produce valid output', () => {

            const { render } = createStyleSheet({

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

            })

            const result = render()

            console.log(result)

            expect(result).contain('@keyframes animateFoo')
            expect(result).contain('from {background:#fff}')
            expect(result).contain('to {background:#000}')

        })
        it('Define keyframes rule with percentage steps: should pass typechecks & produce valid output', () => {{

            const { render } = createStyleSheet({

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

            })

            const result = render()

            console.log(result)

            expect(result).contain('@keyframes animateFoo')
            expect(result).contain('25% {background:#00aaff}')
            expect(result).contain('50% {background:#00aa00}')

        }})

    })

    describe('Nested selector scoped keyframes', () => {

        it('Define keyframes rule with from/to: should pass typechecks & produce valid output', () => {

            const { render } = createStyleSheet({

                foo: {

                    '& div': {

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

            })

            const result = render()

            console.log(result)

            expect(result).contain('@keyframes animateFoo')
            expect(result).contain('from {background:#fff}')
            expect(result).contain('to {background:#000}')

        })
        it('Define keyframes rule with percentage steps: should pass typechecks & produce valid output', () => {{

            const { render } = createStyleSheet({

                foo: {

                    '& div': {

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

            })

            const result = render()

            console.log(result)

            expect(result).contain('@keyframes animateFoo')
            expect(result).contain('25% {background:#00aaff}')
            expect(result).contain('50% {background:#00aa00}')

        }})

    })

    describe('Multiple keyframes rendering', () => {

        it('Define 2 keyframes rules in a single sheet: should produce valid CSS on render', () => {

            const { render } = createStyleSheet({

                foo: {

                    keyframes: [{
                        name: 'animateFoo',
                        steps: [{
                            from: { background: '#000' },
                            to: { background: '#fff' }
                        }]
                    }],

                    animationName: 'animateFoo',
                    animationDuration: '.5s'

                },
                bar: {

                    keyframes: [{
                        name: 'animateBar',
                        steps: [{
                            from: { background: '#000' },
                            to: { background: '#fff' }
                        }]
                    }],

                    animationName: 'animateBar',
                    animationDuration: '.5s'

                }

            })

            const css = render()

            expect(css).contain('@keyframes animateFoo{from {background:#000}to {background:#fff}}')
            expect(css).contain('@keyframes animateBar{from {background:#000}to {background:#fff}}')
            expect(css).contain('.foo {animation-name:animateFoo;animation-duration:.5s}')
            expect(css).contain('.bar {animation-name:animateBar;animation-duration:.5s}')

            // should not produce global-scoped rules with semicolon separation

            expect(css).not.contain('};')


        })

    })

})