import { expect } from 'chai'
import 'mocha'
import { format as pretty } from 'prettier'
import { createTheme } from 'stylight'

describe('Theme unit testing', () => {

    it('Use `createTheme` call to instantiate class picking and rendering context with typings', () => {

        const { styledClass, render } = createTheme({
                obj: { position: 'relative' },
                obj2: { position: 'absolute' }
            }),
            css = render()

        console.log(pretty(css, { parser: 'css' }))
        console.log(styledClass('obj'))

        expect(styledClass('obj')).eq('obj')

        expect(css).contain('.obj {position:relative;}')

    })

    it('Extend theme with custom styles: should extend available values for class picker also', () => {

        const theme = createTheme({

                obj: { position: 'relative' }

            }).extend({

                obj2: { position: 'absolute' }

            }).extend({

                obj3: { position: 'inherit' }

            }),
        { render, styledClass } = theme

        const css = render()

        console.log(pretty(css, { parser: 'css' }))

        expect(styledClass('obj2')).eq('obj2')
        expect(styledClass('obj3')).eq('obj3')


    })

})