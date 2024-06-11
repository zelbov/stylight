import { expect } from 'chai'
import 'mocha'
import React, { useContext } from 'react'
import { renderToString } from 'react-dom/server'
import { StyleRenderer, StyleRenderingContext, Styled, createStyleRenderingContext, useStyle } from 'stylight/react'

describe('ReactContextQuerying tests', () => {

    const Component = () => {

        const styled = useStyle({

            foo: { margin: 0 }

        })

        const context = useContext(StyleRenderingContext)

        if(!context) return null;

        return <div className={styled('foo')}>
            {context.target.sources.length}
        </div>

    }

    it('Query for a top-level StyleRenderingContext explicitly defined in tree: should return context value', () => {

        const app = <StyleRenderingContext.Provider value={createStyleRenderingContext()}>

                <Component/>

                <StyleRenderer/>

            </StyleRenderingContext.Provider>,
            rendered = renderToString(app)

        expect(rendered).contain('<div class="foo">1</div>')
        expect(rendered).contain('.foo {margin:0}')

    })

    it('Query for a top-level StyleRenderingContext defined as a Styled shorthand', () => {

        const app = <Styled>

                <Component/>

                <StyleRenderer/>

            </Styled>,
            rendered = renderToString(app)

        expect(rendered).contain('<div class="foo">1</div>')
        expect(rendered).contain('.foo {margin:0}')

    })

})