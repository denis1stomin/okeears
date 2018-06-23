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
            if (!objective.id) {
                state.newObjective = objective.value;
                return;
            }

            state.objectives.forEach(function (obj) {
                if (obj.id === objective.id)
                    obj.statement = objective.value;
            });
        },

        CREATE_OBJECTIVE(state, payload) {
            state.objectives = payload;
            state.newObjective = '';
        },

        CREATE_OBJECTIVE_FAILED(state, payload) {
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

        // COMMENT : здесь где-то либо через watch либо через EventBus надо
        //           добавить подписку на изменение user.state.selectedSubject.
        //           По изменению будем вызывать action GET_OBJECTIVES()

        GET_OBJECTIVES({commit}) {
            okrSvc.getObjectives(
                user.state.selectedSubject.id,
                data => commit('OBJECTIVES_COMPLETE', data),
                err => commit('OBJECTIVES_FAILED', err)
            );
        },

        CREATE_OBJECTIVE({state, commit}, objective) {
            // clear creator input
            commit('CLEAR_OBJECTIVE');

            // change local objectives list
            let changedList = state.objectives;
            changedList.push(objective);
            commit('OBJECTIVES_COMPLETE', changedList);

            // send request to create new objective
            okrSvc.createObjective(
                user.state.selectedSubject.id,
                objective,
                data => {
                    // when objective is created new id is returned.
                    // we need to update the id field
                    let changedList = state.objectives;
                    let idx = changedList.indexOf(objective);
                    if (idx > -1) {
                        changedList[idx].id = data.id;
                        commit('OBJECTIVES_COMPLETE', changedList);
                    }
                },
                err => commit('CREATE_OBJECTIVE_FAILED', err)
            )
        },

        EDIT_OBJECTIVE({commit}, objective) {
            //commit('EDIT_OBJECTIVE', objective);
        },

        DELETE_OBJECTIVE({state, commit}, objective) {
            // delete from local objectives list
            let idx = state.objectives.indexOf(objective);
            if (idx > -1) {
                state.objectives.splice(idx, 1);
            }

            // send request to delete the objective
            okrSvc.deleteObjective(
                user.state.selectedSubject.id,
                objective.id,
                data => { /* successfully deleted */
                },
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
