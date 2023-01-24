import { expect } from 'chai'
import 'mocha'
import { renderStyleSheet } from 'stylight'

describe('Ms style properties rendering exceptions', () => {

    it('Render stylesheet with ms- styles: should render into correct property definitions', () => {

        const result = renderStyleSheet({

            foo: {

                msContentZooming: 'initial'

            }

        })

        expect(result).contain('-ms-content-zooming')

    })
    
})