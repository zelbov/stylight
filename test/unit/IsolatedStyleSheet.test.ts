import { expect } from 'chai'
import 'mocha'
import { format as pretty } from 'prettier'
import { createStyleSheet } from 'stylight'

describe('Isolated stylesheet unit testing', () => {

    it('Use `createTheme` call to instantiate class picking and rendering context with typings', () => {

        const { styledClass, render } = createStyleSheet({
                obj: { position: 'relative' },
                obj2: { position: 'absolute' }
            }),
            css = render()

        console.log(pretty(css, { parser: 'css' }))
        console.log(styledClass('obj'))

        expect(styledClass('obj')).eq('obj')

        expect(css).contain('.obj {position:relative}')

    })

})