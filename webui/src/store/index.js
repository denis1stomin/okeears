import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import okr from './modules/okr';
import audit from './modules/audit';
import auth from './modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        okr,
        audit,
        auth
    }
});