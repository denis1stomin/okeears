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

        CHANGE_INPUT(state, objective){
            console.log('create', objective);
            state.newObjective = objective;
        },

        ADD_OBJECTIVE(state){
            state.objectives.push({
                statement: state.newObjective
            });
            state.newObjective = '';
        },

        EDIT_OBJECTIVE(state, objective){
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
            state.objectives = objectives;
            state.newObjective = objective.body;
        },

        REMOVE_OBJECTIVE(state, objective){
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
        },

        COMPLETE_OBJECTIVE(state, objective){
            objective.completed = !objective.completed;
        },

        CLEAR_OBJECTIVE(state){
            state.newObjective = '';
        }
    },

    actions: {
        GET_OBJECTIVES({commit}) {
            okrSvc.getSubjectObjectives(
                'me',
                // user.state.selectedSubject.id,
                data => commit('OBJECTIVES_COMPLETE', data),
                err => commit('OBJECTIVES_FAILED', err)
            );
        },

        CREATE_OBJECTIVE({commit}, objective){
            commit('GET_OBJECTIVE', objective);
        },
        
        ADD_OBJECTIVE({commit}){
            commit('ADD_OBJECTIVE');
        },
        
        EDIT_OBJECTIVE({commit}, objective){
            commit('EDIT_OBJECTIVE', objective);
        },
        
        REMOVE_OBJECTIVE({commit}, objective){
            commit('REMOVE_OBJECTIVE', objective);
        },
        
        COMPLETE_OBJECTIVE({commit}, objective){
            commit('COMPLETE_OBJECTIVE', objective);
        },
        
        CLEAR_OBJECTIVE({commit}){
            commit('CLEAR_objective');
        }
    }
}
