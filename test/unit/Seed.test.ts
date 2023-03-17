import { expect } from "chai"
import { createStyleSheet } from "stylight"

describe('Seeding unit testing', () => {

    describe('Isolated sheets with string seed', () => {

        it('Create stylesheet with string seed: should apply for basic base64 transform with prefix', () => {

            const sheet = createStyleSheet({

                    bar: { margin: 0 }

                }, 'foo'),
                result = sheet.render()

            console.log(result)

            expect(result).contain('.'+btoa('foobar'))
            expect(sheet.styledClass('bar')).eq(btoa('foobar'))

        })

        it('Nested styles: should transform into correct composite target', () => {

            const sheet = createStyleSheet({

                bar: {

                    margin: 0,

                    '& div': { margin: 0 }

                }
                
            }, 'foo')

            const result = sheet.render()

            console.log(result)

            expect(result).contain('.'+btoa('foobar'))
            expect(result).contain('.'+btoa('foobar')+' div')
            expect(sheet.styledClass('bar')).eq(btoa('foobar'))

        })

    })

    describe('Isolated sheets with custom seed function', () => {

        it('Custom transform callback for class names', () => {

            const { styledClass, render } = createStyleSheet(
                {
            
                    parent: { margin: 0 },
                    child: { border: '1px solid #000' }
            
                },
                (className) => className.substring(0, 1)
            )
            
            expect(render()).contain('.p {margin:0}.c {border:1px solid #000}')

            expect(styledClass('parent')).eq('p')
            expect(styledClass('child')).eq('c')

        })

    })

})