import Vue from 'vue';
import Vuex from 'vuex';
import VueAutosize from 'vue-autosize';

import user from './modules/user';
import okr from './modules/okr';
import audit from './modules/audit';

Vue.use(Vuex);
Vue.use(VueAutosize);

export default new Vuex.Store({
    modules: {
        user,
        okr,
        audit
    }
});