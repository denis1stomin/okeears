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

        CHANGE_INPUT(state, objective) {
            state.objectives.forEach(function (obj) {
                if (obj.id === objective.id)
                    obj.statement = objective.value;
                else
                    state.newObjective = objective.value
            });
        },

        ADD_OBJECTIVE(state, payload) {
            state.objectives = payload;
            state.newObjective = '';
        },

        ADD_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        EDIT_OBJECTIVE(state, objective) {
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
            state.objectives = objectives;
            state.newObjective = objective.body;
        },

        DELETE_OBJECTIVE(state, objective) {
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        COMPLETE_OBJECTIVE(state, objective) {
            objective.completed = !objective.completed;
        },

        CLEAR_OBJECTIVE(state) {
            state.newObjective = '';
        }
    },

    actions: {
        GET_OBJECTIVES({commit}) {
            okrSvc.getObjectives(
                user.state.selectedSubject.id,
                data => commit('OBJECTIVES_COMPLETE', data),
                err => commit('OBJECTIVES_FAILED', err)
            );
        },

        CREATE_OBJECTIVE({commit}, objective) {
            commit('CHANGE_INPUT', objective);
        },

        ADD_OBJECTIVE({commit}, objective) {
            okrSvc.addObjective(
                user.state.selectedSubject.id,
                objective,
                data => commit('ADD_OBJECTIVE', data),
                err => commit('ADD_OBJECTIVE_FAILED', err)
            )
        },

        EDIT_OBJECTIVE({commit}, objective) {
            commit('EDIT_OBJECTIVE', objective);
        },

        DELETE_OBJECTIVE({commit}, objective) {
            okrSvc.deleteObjective(
                user.state.selectedSubject.id,
                objective.id,
                data => commit('DELETE_OBJECTIVE', data),
                err => commit('DELETE_OBJECTIVE_FAILED', err)
            )
        },

        COMPLETE_OBJECTIVE({commit}, objective) {
            commit('COMPLETE_OBJECTIVE', objective);
        },

        CLEAR_OBJECTIVE({commit}) {
            commit('CLEAR_OBJECTIVE');
        }
    }
}
