import axios from 'axios/index';

const httpClient = axios.create({
    baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.1.0',
    headers: {'Accept': 'application/json'}
});

export default {
    state: {
        objectives: [],

        newObjective: '',

        error: ''
    },

    mutations: {
        OBJECTIVES_COMPLETE(state, objective) {
            state.objectives = objective;
        },

        OBJECTIVES_FAILED(state, objective) {
            state.error = objective;
        },
        
        INPUT_CHANGED(state, objective) {
            state.value[objective.prop] = objective.value;
        },

        CREATE_OBJECTIVE(state, objective) {
            state.newObjective = objective;
        },

        ADD_OBJECTIVE(state, objective) {
            state.objectives.push({
                // ...state.objectives,
                statement: state.newObjective,
            });
            state.newObjective = '';
        },

        EDIT_OBJECTIVE(state, objective) {
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
            state.objectives = objectives;
            state.newObjective = objective.statement;
        },

        REMOVE_OBJECTIVE(state, objective) {
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
        },

        COMPLETE_OBJECTIVE(state, objective) {
            objective.completed = !objective.completed;
        }
    },

    actions: {
        GET_OBJECTIVES({commit}) {
            httpClient.get('/me/objectives')
                .then(response => commit('OBJECTIVES_COMPLETE', response.data))
                .catch(error => commit('OBJECTIVES_FAILED', error));
        },

        CREATE_OBJECTIVE({commit}, objective) {
            commit('CREATE_OBJECTIVE', objective);
        },

        ADD_OBJECTIVE({commit}, objective) {
            httpClient.put('/me/objectives', objective)
                .then(response => commit("ADD_OBJECTIVE", response.data))
                .catch(error => commit("ADD_OBJECTIVE_FAILED", error));
        },

        EDIT_OBJECTIVE({commit}, objective) {
            commit('EDIT_OBJECTIVE', objective);
        },

        REMOVE_OBJECTIVE({commit}, objective) {
            commit('REMOVE_OBJECTIVE', objective);
        },

        COMPLETE_OBJECTIVE({commit}, objective) {
            commit('COMPLETE_OBJECTIVE', objective)
        }
    }
}
