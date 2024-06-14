import { expect } from 'chai'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { StyleRenderer, Styled, useStyle } from 'stylight/react'
import { observeRenderOnce } from './utils/ObserveRenders'

describe('Basic functions browser tests', () => {

    it('Test suite warmup', async function () {

        const App = () => <span>Hello, World!</span>

        const container = document.createElement('div')

        const root = createRoot(container)

        root.render(<App/>)

        // wait for render process to finish asynchronously
        await new Promise(r => setTimeout(r, 1))

        console.log(container.innerHTML)

        expect(container.innerHTML).eq('<span>Hello, World!</span>')
    
    })

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
            '<div class="foo">Hello, World!</div><style type="text/css" data-hydrate-idx="0">.foo {margin:0}</style>'
        )

    })

})