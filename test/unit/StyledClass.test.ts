import { expect } from 'chai'
import 'mocha'
import { styledClass } from 'stylight'

describe('StyledClass unit testing', () => {

    it('Get styled DOM object class: should pick from styling object props', () => {

        const styles = { menu: { margin: 'none' } }

        // if using Typescript, for autocompletion support of class names, styling object type must be provided as generic type parameter
        const className = styledClass<typeof styles>(
            'menu',
            // null values are accepted in case when we need to apply class names conditionally, e.g. `row % 2 ? 'odd' : null`
            null
        )

        console.log(className)

        expect(className).eq('menu')

    })

})