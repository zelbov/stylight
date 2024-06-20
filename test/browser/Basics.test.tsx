import { expect } from 'chai'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { StyleRenderer, Styled, useStyle } from 'stylight/react'
import { observeRenderOnce } from './utils/ObserveRenders'

describe('Basic functions browser tests', () => {

    it('Render full React node tree of basic styling: should succeed and produce valid output', async function () {

        const Component = () => {

            const styled = useStyle({
                foo: { margin: 0 }
            })

            return <div className={styled('foo')}>Hello, World!</div>

        }

        const App = () => <Styled>
            <Component/>
            <StyleRenderer/>
        </Styled>

        const container = document.createElement('div'), root = createRoot(container)

        root.render(<App/>)

        await observeRenderOnce(container)

        console.log(container.innerHTML)

        expect(container.innerHTML).eq(
            '<div class="foo">Hello, World!</div><style type="text/css" data-uid="-1">.foo {margin:0}</style>'
        )

    })

})