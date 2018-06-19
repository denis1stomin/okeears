import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import okr from './modules/okr';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        okr
    }
});
