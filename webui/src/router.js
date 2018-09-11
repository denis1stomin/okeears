import Vue from 'vue'
import Router from 'vue-router'
import OkrEditor from './views/OkrEditor.vue'
import Signin from './views/Signin.vue'

import AuthSvc from './services/authservice'
import TelemetryService from './services/telemetryservice';

Vue.use(Router);

const checkAuth = (to, from, next) => {
    AuthSvc.handleCurrentWindowLocation();

    if (AuthSvc.isAuthenticated()) {
        const user = AuthSvc.getCurrentUser();
        new TelemetryService().setAuthenticatedUser( user.profile.oid );

        next();
        return;
    }

    AuthSvc.login();
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
