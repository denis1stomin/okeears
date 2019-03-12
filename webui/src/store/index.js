import Vue from 'vue';
import Vuex from 'vuex';
import VueTextareaAutosize from 'vue-textarea-autosize';

import user from './modules/user';
import okr from './modules/okr';

Vue.use(Vuex);
Vue.use(VueTextareaAutosize);

export default new Vuex.Store({
    modules: {
        user,
        okr
    }
});