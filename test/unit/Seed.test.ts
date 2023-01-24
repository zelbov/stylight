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

        })

    })

    describe('Isolated sheets with custom seed function', () => {

        //TODO: add tests for custom seed function

    })

})