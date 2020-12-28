import { createTypes, VueTypesInterface } from 'vue-types'

const PropTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    array: undefined,
    object: undefined
})

export default PropTypes as VueTypesInterface
