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

})