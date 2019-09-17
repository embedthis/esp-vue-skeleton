/*
    ${UMODEL}-routes.js - ${UMODEL} routes (esp-vue-skeleton)
 */
import ${UMODEL}Edit from './edit.vue'
import ${UMODEL}List from './list.vue'

export default [{
        path: '/${MODEL}',
        name: '${MODEL}-list',
        component: ${UMODEL}List
    }, {
        path: '/${MODEL}/:id',
        name: '${MODEL}-edit',
        component: ${UMODEL}Edit
    }
]
