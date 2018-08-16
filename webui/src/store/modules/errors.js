export default {
    state: {
        errors: []
    },

    mutations: {
        ADD_ERROR(state, err) {
            state.errors.push(err);
        },

        DELETE_ERROR(state, err) {
            // TODO : delete from array
        },

        CLEAR_ALL(state) {
            //state.errors.length = 0;
            state.errors = [];
        }
    },

    actions: {
        SHOW_ERROR({commit, err}) {
            commit('ADD_ERROR', err);
        },

        HIDE_ERROR({commit}, err) {
            commit('DELETE_ERROR', err);
        },

        HIDE_ALL({commit}) {
            commit('CLEAR_ALL');
        }
    }
}
