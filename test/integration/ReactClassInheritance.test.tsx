import { expect } from 'chai'
import 'mocha'
import React, { DetailedHTMLProps, HTMLAttributes } from 'react'
import { renderToString } from 'react-dom/server'
import { Styled, StyleRenderer, useStyle } from 'stylight/react'

describe('ReactClassInheritance integration testing', () => {

    const StyledChild = (
        props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    ) => {

        const styled = useStyle({
            child: { border: '1px solid #000' }
        })

        return <div {...props} className={styled('child', props.className)}></div>
        
    }

    const StyledParent = () => {

        const styled = useStyle({
            inheritedParentStyles: { margin: 0 }
        })

        return <StyledChild className={styled('inheritedParentStyles')}/>

    }

    it('Test styles inheritance and typechecking through passing className to children down a tree', () => {

        const App = () => <Styled>

            <StyledParent/>

            <StyleRenderer/>

        </Styled>

        const rendered = renderToString(<App/>)

        console.log(rendered)

        expect(rendered).contain('border:1px solid #000')
        expect(rendered).contain('margin:0')
        expect(rendered).contain('class="child inheritedParentStyles"')

    })

})