import './styles/main.less';

import Vue from 'vue';
import App from './App.vue'
import store from './store'
import router from './router'

//import auth from '@/auth'
//Vue.use(auth)

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');

//new Vue({
//    el: '#app',
//    store,
//    render: h => h(App)
//});
