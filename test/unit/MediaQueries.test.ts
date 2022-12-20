import 'mocha'
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

        console.log(css)

        //TODO: regex match based test for whole stylesheet consistency check
        expect(css).contain('.foo {position:inherit;}')
        expect(css).contain('.bar {position:inherit;}')
        expect(css).contain('@media (all) and (max-width: 1280px) and (min-width: 600px)')
        expect(css).contain('.foo {position:relative;}')

    })

})