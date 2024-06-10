import 'mocha'
import { format as pretty } from 'prettier'
import { expect } from 'chai'
import { renderStyleSheet } from 'stylight'

describe('MediaQueries unit testing', () => {

    it('Define media query target: should render correct media query', () => {

        const css = renderStyleSheet({

            foo: {
                
                position: 'inherit',

                // declare media query overrides for targeted selector
                media: [
                    {

                        "min-width": '600px',
                        "max-width": '1280px',

                        "all": '',

                        css: {

                            position: 'relative',

                        }

                    }
                ],
            
            },

            bar: {
                
                position: 'inherit',
                media: [{

                    "min-width": '600px',
                    "max-width": '1280px',

                    "all": '',

                    css: {

                        position: 'absolute'

                    }

                }]
            
            },

        })

        console.log(pretty(css, { parser: 'css' }))

        //TODO: regex match based test for whole stylesheet consistency check
        expect(css).contain('.foo {position:inherit}')
        expect(css).contain('.bar {position:inherit}')
        expect(css).contain('@media (all) and (max-width:1280px) and (min-width:600px)')
        expect(css).contain('.foo {position:relative}')

    })

    describe('Literals scoping inside media queries', () => {

        it('Render literals within media query scope', () => {

            const sheet = renderStyleSheet({

                literals: {

                    body: {

                        marginTop: '0'

                    }

                },
            
                foo: {
    
                    media: [{
    
                        "max-width": '800px',
    
                        css: {
    
                            literals: {
    
                                body: {
    
                                    margin: '0'
    
                                }
    
                            }
    
                        }
    
                    }]
    
                }
    
            })
    
            expect(sheet).eq('body {margin-top:0}@media (max-width:800px){body {margin:0}}')

        })

    })

    describe('Media queries in literals', () => {

        it('Render media query inside literal selector scope', () => {

            const sheet = renderStyleSheet({

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

            })

            expect(sheet).eq('@media (max-width:400px){body {margin:0}}')

        })

    })

})