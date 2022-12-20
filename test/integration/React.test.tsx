import { expect } from 'chai'
import 'mocha'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStyleRenderingContext, Styled, StyleRenderer, StyleRenderingContext, useStyle } from 'stylight/react'

describe('React integration testing', () => {

    const StyledComponent = () => {

        const styled = useStyle({
            obj: { border: '1px solid #000' }
        })

        return <div className={styled('obj')}></div>

    }

    it('Create react app with styling provider: should render styles', () => {

        const App = () => <StyleRenderingContext.Provider value={createStyleRenderingContext()}>
                
                <StyledComponent/>
                
                <StyleRenderer/>

            </StyleRenderingContext.Provider>,
            instance = <App/>

        const str = renderToString(instance)

        expect(str).contain('.obj {border:1px solid #000;}')

    })

    it('Create React app with shorthand style rendering context: should render children & styles', () => {

        const App = () => <Styled>
                    <StyledComponent/>
                    <StyleRenderer/>
                </Styled>,
            rendered = renderToString(<App/>)

        console.log(rendered)
        expect(rendered).contain('.obj {border:1px solid #000;}')

    })

})