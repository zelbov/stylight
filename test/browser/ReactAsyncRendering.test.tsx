import 'mocha'
import { expect } from 'chai'
import React, { useEffect, useState } from 'react'
import { StyleRenderer, Styled, useStyle } from 'stylight/react'
import { createRoot } from 'react-dom/client'
import { observeRendersUntil } from './utils/ObserveRenders'

describe('ReactAsyncRendering tests', () => {

    describe('Duplicate styles rendering tests', () => {

        it('Render app with async components: should not produce duplicate styles or impoperly ordered nodes', async function () {

            const Component = () => {
            
                const [state, setState] = useState(0)
    
                // mutable style
                const styled = useStyle({
                    obj: { border: `1px solid ${state == 1 ? '#fff' : '#000'}` }
                }, { mutate: () => state == 1 })
    
                // immutable synchronously rendered style
                useStyle({
    
                    literals: { body: { margin: 0 }}
    
                })
    
                useEffect(() => {
                    // initiate state update once more
                    if(state == 0) setState(1)
                })
            
                return <div className={styled('obj')}>{
                    // render asynchronously initialized component at second render
                    state == 1 ? <AsyncComponent/> : null
                }</div>
            
            }
            
            const AsyncComponent = () => {
            
                // immutable asynchronous style
                const styled = useStyle({
                    obj2: { border: 'none' }
                })
            
                return <div className={styled('obj2')}></div>
            
            }
    
            const App = () => <Styled>
                <Component/>
                <StyleRenderer/>
            </Styled>
    
            const container = document.createElement('div'), root = createRoot(container)
    
            root.render(<App/>)
    
            const renders = await observeRendersUntil(
                    container,
                    // wait until a stylesheet of async object renders
                    (n) => n.textContent && n.textContent.match(/\.obj2\s\{/) ? true : false
                ),
                totalMutations = renders.reduce((prev, next) => prev + next.addedNodes.length, 0)

            console.log(container.innerHTML)
    
            /* breakdown:
                div.obj with children: div.obj2
                style(core, sync)
                style(obj, mutate)
                style(obj2, async)
            */

            expect(totalMutations).eq(4) // 1 div tag with 1 child div, 3 style tags

            // parent div
            expect(renders[0].addedNodes[0].nodeName).eq('DIV')
            
            // sync-rendered composed styles
            expect(renders[1].addedNodes[0].nodeName).eq('STYLE')
            expect(renders[1].addedNodes[0].textContent).eq('.obj {border:1px solid #000}body {margin:0}')

            // mutated style, appended as an override
            expect(renders[2].addedNodes[0].nodeName).eq('STYLE')
            expect(renders[2].addedNodes[0].textContent).eq('.obj {border:1px solid #fff}')

            // style of async-rendered component
            expect(renders[3].addedNodes[0].nodeName).eq('STYLE')
            expect(renders[3].addedNodes[0].textContent).eq('.obj2 {border:none}')
    
        })
    
        it('Render async components multiple times after first render: should not produce duplicate styles', async function(){

            const Component = () => {
            
                const [state, setState] = useState(0)
    
                // mutable style
                const styled = useStyle({
                    obj: { border: `1px solid ${state == 1 ? '#fff' : '#000'}` }
                }, { mutate: () => state == 1 })
    
                // immutable synchronously rendered style
                useStyle({
    
                    literals: { body: { margin: 0 }}
    
                })
    
                useEffect(() => {
                    // initiate state update once more
                    if(state == 0) setState(1)
                })
            
                return <div className={styled('obj')}>{
                    // render asynchronously initialized component at second render
                    state == 1 ? <AsyncComponent/> : null
                }</div>
            
            }
            
            const AsyncComponent = () => {

                const [state, setState] = useState(0)
            
                // mutable asynchronous style
                const styled = useStyle({
                    obj2: { border: 'none', margin: `${state}px` }
                }, { mutate: () => state == 1 })

                useEffect(() => {
                    // initiate state update once more
                    if(state == 0) setState(1)
                })
            
                return <div className={styled('obj2')}></div>
            
            }
    
            const App = () => <Styled>
                <Component/>
                <StyleRenderer/>
            </Styled>
    
            const container = document.createElement('div'), root = createRoot(container)
    
            root.render(<App/>)
    
            const renders = await observeRendersUntil(
                    container,
                    // wait until a stylesheet of async object mutates
                    (n) => n.textContent && n.textContent.match(/margin\:1px/) ? true : false
                ),
                totalMutations = renders.reduce((prev, next) => prev + next.addedNodes.length, 0)

            console.log(container.innerHTML)
    
            /* breakdown:
                div.obj with children: div.obj2
                style(core, sync)
                style(obj, mutate)
                style(obj2, async second render, mutated style)
            */

            expect(totalMutations).eq(4) // 1x div, 4x style

            // parent div
            expect(renders[0].addedNodes[0].nodeName).eq('DIV')
            
            // sync-rendered composed styles
            expect(renders[1].addedNodes[0].nodeName).eq('STYLE')
            expect(renders[1].addedNodes[0].textContent).eq('.obj {border:1px solid #000}body {margin:0}')

            // mutated style, appended as an override
            expect(renders[2].addedNodes[0].nodeName).eq('STYLE')
            expect(renders[2].addedNodes[0].textContent).eq('.obj {border:1px solid #fff}')

            // style of async-rendered component, re-rendered as mutated
            expect(renders[3].addedNodes[0].nodeName).eq('STYLE')
            expect(renders[3].addedNodes[0].textContent).eq('.obj2 {border:none;margin:1px}')

            // total nodes
            expect(container.childNodes.length).eq(4)

        })

    })
    
})