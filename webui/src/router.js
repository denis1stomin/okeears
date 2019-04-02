import Vue from 'vue'
import Router from 'vue-router'
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

        // Use userId hash as identifier
        const encoder = new TextEncoder();
        const data = encoder.encode(user.profile.oid);
        window.crypto.subtle.digest('SHA-256', data).then(digest => {
            const strHash = hexString(digest);
            new TelemetryService().setAuthenticatedUser(strHash);
        });

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
