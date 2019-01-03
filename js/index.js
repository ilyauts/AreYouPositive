import Vue from 'vue';
import axios from 'axios';
import VueRouter from 'vue-router';

// Components
import Main from '../components/Main.vue';
import store from '../store/store';

class Index {
    constructor() {
        // ensures that the console in the browser can work with the elements
        Vue.config.devtools = true;

        Vue.use(VueRouter);

        // Create the router
        const router = new VueRouter({
            mode: 'history',
            base: __dirname,
            routes: [{
                path: '/',
                component: Main,
            }],
        });

        const app = new Vue({
            router,
            el: '#vue',
            components: {
                Main,
            },
            data: {
                currentRoute: window.location.pathname,
            },
            store,
            computed: {},
            beforeMount() {
                axios.interceptors.request.use((config) => {
                    if (!config.headers) config.headers = {};
                    config.headers['Content-Type'] = 'application/json';
                    return config;
                });
            },
        });
    }
}
new Index();