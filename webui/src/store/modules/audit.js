import auditSvc from './../../services/auditservice';

export default {
    state: {
        changes: [],

        error: ''
    },

    mutations: {

        GET_CHANGES(state, payload) {
            state.objectives = payload;
        },

        POST_CHANGE(state, payload) {
        },

        REQUEST_FAILED(state, err) {
            state.error = err;
        }
    },

    actions: {

        GET_CHANGES({commit}) {
            let changes = auditSvc.getLogs();
            commit('GET_CHANGES', changes);
        },

        POST_CHANGE({state, commit}, change) {
            state.changes.push(change);
            auditSvc.log(change);
        }
    }
}
