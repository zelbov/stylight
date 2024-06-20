import 'mocha'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createStyleSheet } from 'stylight'
import { StyleRenderer, Styled, useStyle } from 'stylight/react'
import { observeRenderOnce } from './utils/ObserveRenders'
import { expect } from 'chai'

describe('ReactHookSeeding tests', () => {

    it('Provide a seed separately for `createStyleSheet`: should pass seeding alongside with stylesheet into `useStyle`', async function() {

        const sheet = createStyleSheet({
            foo: { margin: 0 }
        }, 'seed!')

        const Component = () => {

            const styled = useStyle(sheet)

            return <div className={styled('foo')}></div>

        }

        const App = () => <Styled><Component/><StyleRenderer/></Styled>

        const container = document.createElement('div'), root = createRoot(container)

        root.render(<App/>)

        const updates = await observeRenderOnce(container)

        console.log(container.innerHTML)

        // shoul produce 2 nodes total within one render
        const totalNodes = updates.reduce((prev, curr) => prev += curr.addedNodes.length, 0)
        expect(totalNodes).eq(2)

        const seededClassName = window.btoa('seed!foo')

        expect(container.innerHTML).contain(`<div class="${seededClassName}"></div>`)
        expect(container.innerHTML).contain(`.${seededClassName} {margin:0}`)

    })

    it('Provide a seed directly into `useStyle` hook: should produce same result', async function(){

        const Component = () => {

            const styled = useStyle({
                foo: { margin: 0 }
            }, { seed: 'seed!' })

            return <div className={styled('foo')}></div>

        }

        const App = () => <Styled><Component/><StyleRenderer/></Styled>

        const container = document.createElement('div'), root = createRoot(container)

        root.render(<App/>)

        const updates = await observeRenderOnce(container)

        console.log(container.innerHTML)

        // shoul produce 2 nodes total within one render
        const totalNodes = updates.reduce((prev, curr) => prev += curr.addedNodes.length, 0)
        expect(totalNodes).eq(2)

        const seededClassName = window.btoa('seed!foo')

        expect(container.innerHTML).contain(`<div class="${seededClassName}"></div>`)
        expect(container.innerHTML).contain(`.${seededClassName} {margin:0}`)

    })

})