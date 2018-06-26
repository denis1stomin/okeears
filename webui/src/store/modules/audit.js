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

        GET_AUDIT_LOGS({commit}) {
            let changes = auditSvc.getLogs();
            commit('GET_CHANGES', changes);
        },

        POST_AUDIT_ITEM({state, commit}, newChange) {
            let changes = state.changes;
            changes.push(newChange);
            commit('GET_CHANGES', changes);

            auditSvc.log(newChange);
        }
    }
}
