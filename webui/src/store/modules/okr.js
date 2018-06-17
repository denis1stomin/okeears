import okrSvc from './../../services/okrservice';
import user from './user'

export default {
    state: {
        objectives: [],

        newObjective: '',

        error: ''
    },

    mutations: {
        OBJECTIVES_COMPLETE(state, payload) {
            state.objectives = payload;
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload;
        },

        INPUT_CHANGED(state, payload) {
            state.newObjective = payload.newObjective;
        },
    },

    actions: {
        GET_OBJECTIVES({commit}) {
            okrSvc.getSubjectObjectives(
                'me',
                // user.state.selectedSubject.id,
                data => commit('OBJECTIVES_COMPLETE', data),
                err => commit('OBJECTIVES_FAILED', err)
            );
        }
    }
}
