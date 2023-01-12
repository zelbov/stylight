import 'mocha'
import React from 'react'
import { format as pretty } from 'prettier'
import { Styled, StyleRenderer, useStyle } from 'stylight/react'
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

    it('Create React app with shorthand styling renderer and Helmet wrap: should render styles in head', () => {

        const App = () => <Styled>

            <Helmet title='Helmet Test #2'/>

            <StyledComponent/>

            <StyleRenderer wrap={ (styleTags) => <Helmet>{styleTags}</Helmet> }/>

        </Styled>

        renderToString(<App/>)

        const helmet = Helmet.renderStatic()

        console.log(pretty(helmet.title.toString(), { parser: 'html' }))
        console.log(pretty(helmet.style.toString(), { parser: 'html' }))

        expect(helmet.title.toString()).contain('Helmet Test #2').and.contain('<title')

        expect(helmet.style.toString()).contain('.obj {border:1px solid #000;}').and.contain('<style')

    })

})