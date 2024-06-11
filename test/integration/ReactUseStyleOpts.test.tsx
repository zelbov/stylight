import React from 'react'
import 'mocha'
import { Styled, StyleRenderer, useStyle } from 'stylight/react'
import { renderToString } from 'react-dom/server'
import { expect } from 'chai'
import { createStyleSheet } from 'stylight'

describe('ReactUseStyle hook param variations testing', () => {

    it('Pass StyleSheetObject into hook: should render without class names transformation', () => {

        const Component = () => {

            const styled = useStyle({
                foo: {
                    margin: 0
                }
            })

            return <div className={styled('foo')}></div>

        }

        const App = () => <Styled>

            <Component/>

            <StyleRenderer/>

        </Styled>

        const result = renderToString(<App/>)

        console.log(result)

        expect(result).contain('.foo')
        expect(result).contain('margin:0')

    })

    it('Pass StyleSheetInit as hook parameter: should render sheet with class names seeding', () => {

        const sheet = createStyleSheet({
            foo: {
                margin: 0
            }
        }, 'seed')

        const Component = () => {

            const styled = useStyle(sheet)

            return <div className={styled('foo')}></div>

        }

        const App = () => <Styled>

            <Component/>

            <StyleRenderer/>

        </Styled>

        const result = renderToString(<App/>)

        console.log(result)

        expect(result).contain('.'+Buffer.from('seedfoo').toString('base64'))
        expect(result).contain('margin:0')

    })

    it('Pass seed into useStyle hook: should apply to rendered styles and class picker output', () => {

        const Component = () => {

            const styled = useStyle({
                foo: { margin: 0 }
            }, 'seed')

            return <div className={styled('foo')}></div>

        }

        const App = () => <Styled>

            <Component/>

            <StyleRenderer/>

        </Styled>

        const result = renderToString(<App/>)

        console.log(result)

        expect(result).contain('.'+Buffer.from('seedfoo').toString('base64'))
        expect(result).contain('margin:0')

    })

})