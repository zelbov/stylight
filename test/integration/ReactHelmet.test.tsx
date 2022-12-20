import 'mocha'
import React from 'react'
import { createStyleRenderingContext, Styled, StyleRenderer, StyleRenderingContext, useStyle } from 'stylight/react'
import { Helmet } from 'react-helmet'
import { renderToString } from 'react-dom/server'
import { expect } from 'chai'

describe('ReactHelmet integration testing', () => {

    const StyledComponent = () => {

        const styled = useStyle({
            obj: { border: '1px solid #000' }
        })

        return <div className={styled('obj')}></div>

    }

    it('Create react app with styling renderer wrapped into Helmet: should render styles in head', () => {

        const App = () => 

            <StyleRenderingContext.Provider value={createStyleRenderingContext()}>

                <Helmet title='Helmet Test'/>

                <StyledComponent/>

                {
                    // Option 1: Wrap CSS string into Helmet style property
                }
                <StyleRenderer wrapContent={ (cssText) => <Helmet style={[{ cssText }]}/> }/>

                {
                    // Option 2: wrap style tag with rendered CSS as child into Helmet
                }
                <StyleRenderer wrapElement={ (styleTag) => <Helmet>{styleTag}</Helmet> }/>

            </StyleRenderingContext.Provider>

        renderToString(<App/>)

        const helmet = Helmet.renderStatic()

        expect(helmet.title.toString()).contain('Helmet Test').and.contain('<title')

        expect(helmet.style.toString()).contain('.obj {border:1px solid #000;}').and.contain('<style')

    })

    it('Create React app with shorthand styling renderer and Helmet wrap: should render styles in head', () => {

        const App = () => <Styled>

            <Helmet title='Helmet Test #2'/>

            <StyledComponent/>

            <StyleRenderer wrapElement={ (styleTag) => <Helmet>{styleTag}</Helmet> }/>

        </Styled>

        renderToString(<App/>)

        const helmet = Helmet.renderStatic()

        console.log(helmet.title.toString())
        console.log(helmet.style.toString())

        expect(helmet.title.toString()).contain('Helmet Test #2').and.contain('<title')

        expect(helmet.style.toString()).contain('.obj {border:1px solid #000;}').and.contain('<style')

    })

})