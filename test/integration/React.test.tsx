import { expect } from 'chai'
import 'mocha'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStyleRenderingContext, StyleRenderer, StyleRenderingContext, useStyle } from 'stylight/react'

describe('React integration testing', () => {

    it('Create react app with styling provider: should render styles', () => {

        const StyledComponent = () => {

            const styled = useStyle({
                obj: { border: '1px solid #000' }
            })

            return <div className={styled('obj')}></div>

        }

        const App = () => <StyleRenderingContext.Provider value={createStyleRenderingContext()}>
                
                <StyledComponent/>
                
                <StyleRenderer/>

            </StyleRenderingContext.Provider>,
            instance = <App/>

        const str = renderToString(instance)

        console.log(str)

        expect(str).contain('.obj {border:1px solid #000;}')

    })

})