import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import Mock from './mock'
import jQuery from 'jquery'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isLogin } from './api/api'
Mock.bootstrap();

import "./styles/global.scss"
import setTitle from "./common/js/setTitle.js"
Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if(to.query.source) {
        localStorage.setItem('source', to.query.source);
    }


    if (to.matched.some(record => record.meta.requiresAuth)) {
        NProgress.start();
        isLogin({}).then(res => {
            NProgress.done();

            let { code, msg, data } = res;

            if (code !== 0) {
                next({
                    path: '/login'
                })
            } else {
                next()
            }
        });
    } else {
        next()
    }
});

router.afterEach((transition) => {
    let title = transition.name;
    setTitle(title);
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')