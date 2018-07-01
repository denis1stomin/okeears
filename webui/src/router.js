import Vue from 'vue'
import Router from 'vue-router'
import OkrEditor from './views/OkrEditor.vue'
import Signin from './views/Signin.vue'
import auth from './store/modules/auth'

Vue.use(Router);

const checkAuth = (to, from, next) => {
    if (auth.getters.IS_AUTHENTICATED()) {
        next();
        return;
    }

    auth.actions.HANDLE_CURRENT_LOCATION();

    if (auth.getters.IS_AUTHENTICATED()) {
        next();
        return;
    }

    auth.actions.LOGIN();
};

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: OkrEditor,
            beforeEnter: checkAuth
        },
        {
            path: '/signin',
            name: 'signin',
            component: Signin,
            beforeEnter: (to, from, next) => { next({ name: 'home' }) }
        }

        // TODO : signout
        // TODO : home page before user is authenticated page
        // TODO : fake editor page ?
        // TODO : user settings page
    ]
});

export default router
