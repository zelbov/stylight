import 'mocha'
import { expect } from 'chai'
import { format as pretty } from 'prettier'
import { renderStyleSheet } from 'stylight'

describe('Style rendering unit testing', () => {

    it('Render simple styling object: should succeed & return valid string', () => {

        const rendered = renderStyleSheet({ menu: { border: '1px solid #000' } })
        
        console.log(pretty(rendered, { parser: 'css' }))

        expect(rendered.trim()).eq('.menu {border:1px solid #000}')

    })

    it('Render nested styles: should return valid string with nested style rules', () => {

        const rendered = renderStyleSheet({
            menu: {
                border: '1px solid #000',
                '& div': { backgroundColor: 'red' }
            }
        })

        console.log(pretty(rendered, { parser: 'css' }))
        
        expect(rendered).contain('.menu {border:1px solid #000}')
        expect(rendered).contain('.menu div {background-color:red}')


    })

    it('Render overrides of same property: should return valid set of CSS properties', () => {

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

        const rendered = renderStyleSheet(styles)

        console.log(pretty(rendered, { parser: 'css' }))

        expect(rendered).contain('filter:progid:DXImageTransform')
        expect(rendered).contain('background:rgb(35,85,63)')
        expect(rendered).contain('background:-moz-linear-gradient')
        expect(rendered).contain('background:-webkit-linear-gradient')
        expect(rendered).contain('background:linear-gradient')

    })

    it('Render overrides of multiple properties: should return valid set of CSS properties', () => {

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
                        '-moz-linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%)',
                        MozBackgroundSize: 'auto',
                    },
                    {
                        // webkit
                        background:
                        '-webkit-linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%)',
                        WebkitBackgroundSize: 'auto',
                    },
                    {
                        // common
                        background:
                        'linear-gradient(50deg, rgba(35,85,63,1) 1%, rgba(50,127,131,1) 55%, rgba(4,19,22,1) 100%)',
                        backgroundSize: 'auto'
                    },
                ],

            }
        
        }

        const rendered = renderStyleSheet(styles)

        console.log(pretty(rendered, { parser: 'css' }))

        expect(rendered).contain('filter:progid:DXImageTransform')
        expect(rendered).contain('background:rgb(35,85,63)')
        expect(rendered).contain('background:-moz-linear-gradient')
        expect(rendered).contain('-moz-background-size:auto')
        expect(rendered).contain('background:-webkit-linear-gradient')
        expect(rendered).contain('-webkit-background-size:auto')
        expect(rendered).contain('background:linear-gradient')

    })

    it('Render mixins from style objects: should contain references to global descriptors', () => {

        const styles = {
            foo: {
                mixins: {
                    body: { margin: 'none' }
                }
            }
        }

        const rendered = renderStyleSheet(styles)

        console.log(pretty(rendered, { parser: 'css' }))

        expect(rendered).contain('body {margin:none}')
        expect(rendered).not.contain('.body')

    })

})