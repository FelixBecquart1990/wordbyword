import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import {store} from './store'
const fb = require('./firebaseConfig.js')
import './registerServiceWorker'

Vue.config.productionTip = false


// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})


// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')





