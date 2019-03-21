import Vue from 'vue';
import Vuex from 'vuex';
import VueAutosize from 'vue-autosize';
import VueTextareaAutosize from 'vue-textarea-autosize';

import user from './modules/user';
import okr from './modules/okr';

Vue.use(Vuex);
Vue.use(VueAutosize);
Vue.use(VueTextareaAutosize);

export default new Vuex.Store({
    modules: {
        user,
        okr
    }
});