import 'mocha'
import { expect } from 'chai'
import React, { useEffect, useState } from 'react'
import { StyleRenderer, Styled, useStyle } from 'stylight/react'
import { createRoot } from 'react-dom/client'
import { Helmet } from 'react-helmet'
import { Subject } from 'rxjs'

describe('ReactMutableStyles tests', () => {

    it('Re-render during async component init: should not produce duplicate stylesheets on re-render', async function () {

        const onrender = new Subject<void>()

        const StyledComponent = () => {

            const styled = useStyle({
                obj: { border: '1px solid #000' }
            })
        
            const [state, setState] = useState(0)
        
            useEffect(() => {
                // initiate state update once more
                if(state == 0) {
                    setState(1)
                } else onrender.next() // notify async component init
            })
        
            return <div className={styled('obj')}>{
                // render asynchronously initialized component at second render
                state == 1 ? <AsyncComponent/> : null
            }</div>
        
        }
        
        const AsyncComponent = () => {
        
            const styled = useStyle({
                obj2: { border: 'none' }
            })
        
            return <div className={styled('obj2')}></div>
        
        }
        
        const App = () => <Styled>

            <StyledComponent/>

            <StyleRenderer wrap={ (styleTags) => <Helmet>{styleTags}</Helmet> }/>

        </Styled>

        const container = document.createElement('div')
                
        const root = createRoot(container)

        root.render(<App/>)

        await new Promise(r => onrender.subscribe(r))

        onrender.complete()

        const html = container.innerHTML

        expect(html).eq('<div class="obj"><div class="obj2"></div></div>')

        const head = document.head.innerHTML

        console.log(head)

        expect(head.split('.obj {').length).eq(2) // should not produce more than one style for this selector
        expect(head.split('.obj2 {').length).eq(2) // should not produce more than one style for this selector

    })

})