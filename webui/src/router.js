import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from './views/LandingPage.vue'
import OkrEditor from './views/OkrEditor.vue'
import Signin from './views/Signin.vue'

import AuthSvc from './services/authservice'
import TelemetryService from './services/telemetryservice';

Vue.use(Router);

const hexString = buffer => {
    const byteArray = new Uint8Array(buffer);

    const hexCodes = [...byteArray].map(value => {
      const hexCode = value.toString(16);
      const paddedHexCode = hexCode.padStart(2, '0');
      return paddedHexCode;
    });

    return hexCodes.join('');
  }

const checkAuth = (to, from, next) => {
    AuthSvc.handleCurrentWindowLocation();

    if (AuthSvc.isAuthenticated()) {
        const user = AuthSvc.getCurrentUser();

        // Using userId hash as identifier
        const encoder = new TextEncoder();
        const data = encoder.encode(user.profile.oid);
        window.crypto.subtle.digest('SHA-256', data).then(digest => {
            const strHash = hexString(digest);
            new TelemetryService().setAuthenticatedUser(strHash);
        });

        if (to.path === '/editor')
            next();
        else
            next({ name: 'editor' });
        
        return true;
    }

    next();
    return false;
};

const ensureAuth = (to, from, next) => {
    if (!checkAuth(to, from, next)) {
        AuthSvc.login();
    }
};

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: LandingPage,
            beforeEnter: checkAuth
        },
        {
            path: '/editor',
            name: 'editor',
            component: OkrEditor,
            beforeEnter: ensureAuth
        },
        {
            path: '/signin',
            name: 'signin',
            component: Signin,
            beforeEnter: (to, from, next) => { next({ name: 'home' }) }
        }

        // TODO : fake editor page ?
        // TODO : user settings page
    ]
});

export default router
