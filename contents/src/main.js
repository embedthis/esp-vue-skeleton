/*
    main.js -- Manager UI Main
 */

import 'js-polyfill'
import Vue from 'vue'
import vuetify from './vuetify'
import App from './App.vue'
import Router from 'vue-router'
import Net from 'js-net'

import routes from './routes.js'
import VuFeedback from 'vu-feedback'
import VuInput from 'vu-input'
import VuInputGroup from 'vu-input-group'
import VuValidate from 'vu-validate'

Vue.config.productionTip = false
Net.setConfig(netCallback, {prefix: "http://127.0.0.1:8000/api"})

Vue.use(Router)
Vue.component('vu-feedback', VuFeedback)
Vue.component('vu-input', VuInput)
Vue.component('vu-input-group', VuInputGroup)
Vue.component('vu-validate', VuValidate)

const router = new Router({
    mode: 'history',
    routes
})

Vue.mixin({
    methods: {
        navigate: function(url) { router.push(url) },
        titlecase: function(str) {
            var words = str.split(/[ \.]/g)
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
            }
            return words.join(' ')
        }
    }
})

Vue.directive('to', {
    bind: function(container, binding, vnode) {
        container.addEventListener('click', (event) => {
            router.push(binding.value)
        })
    }
})

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')

/*
    Remote net request interceptor (see js-net)
 */
function netCallback(reason, args) {
    let feedback = Vue.prototype.$feedback
    let progress = Vue.prototype.$progress

    if (args == 'clear') {
        feedback.clear()

    } else if (reason == 'feedback') {
        feedback.response(args)

    } else if (reason == 'login') {
        this.navigate('/auth/login')

    } else if (reason == 'logout') {
        this.store.dispatch('logout')

    } else if (reason == 'start') {
        progress.start()

    } else if (reason == 'stop') {
        progress.stop()
    }
}
