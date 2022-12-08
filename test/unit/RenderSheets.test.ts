import 'mocha'
import { expect } from 'chai'
import { renderStyleSheet } from 'stylight'

describe('Style rendering unit testing', () => {

    it('Render simple styling object: should succeed & return valid string', () => {

        const rendered = renderStyleSheet({ menu: { border: '1px solid #000' } })
        expect(rendered.trim()).eq('.menu {border:1px solid #000;}')

    })

    it('Render nested styles: should return valid string with nested style rules', () => {

        const rendered = renderStyleSheet({
            menu: {
                border: '1px solid #000',
                '& div': { backgroundColor: 'red' }
            }
        })
        
        expect(rendered).contain('.menu {border:1px solid #000;}')
        expect(rendered).contain('.menu div {background-color:red;}')


    })

})