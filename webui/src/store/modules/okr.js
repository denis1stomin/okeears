import OkrService from './../../services/okrservice';
import user from './user'

let okrSvc = new OkrService();

export default {
    state: {
        objectives: [],
        error: ''
    },

    mutations: {
        OBJECTIVES_COMPLETE(state, payload) {
            state.error = null;
            state.objectives = payload;
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload;
        },

        CREATE_OBJECTIVE(state, payload) {
            state.error = null;
            state.objectives = payload;
        },

        CREATE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        DELETE_OBJECTIVE(state, objective) {
            state.error = null;
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        }
    },

    actions: {
        GET_OBJECTIVES({commit}) {
            okrSvc.getObjectives(
                user.state.selectedSubject.id,
                user.state.me.id,
                data => commit('OBJECTIVES_COMPLETE', data),
                err => commit('OBJECTIVES_FAILED', err)
            );
        },

        CREATE_OBJECTIVE({state, commit}, objective) {
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

        COPY_OBJECTIVE_TO_CURRENT_USER({state, commit}, objective) {
            // Need to update model only if copy own objective
            if (user.state.me.id === user.state.selectedSubject.id) {
                let changedList = state.objectives;
                changedList.push(objective);
                commit('OBJECTIVES_COMPLETE', changedList);
            }

            // send request to create objective copy
            okrSvc.createObjective(
                user.state.me.id,
                objective,
                data => {
                    // Need to update model only if copy own objective
                    if (user.state.me.id === user.state.selectedSubject.id) {
                        // when objective is created new id is returned.
                        // we need to update the id field
                        let changedList = state.objectives;
                        let idx = changedList.indexOf(objective);
                        if (idx > -1) {
                            changedList[idx].id = data.id;
                            commit('OBJECTIVES_COMPLETE', changedList);
                        }
                    }
                },
                err => commit('CREATE_OBJECTIVE_FAILED', err)
            )
        },

        EDIT_OBJECTIVE({state, commit}, objective) {
            // update in local objectives list
            let idx = state.objectives.findIndex((x) => x.id === objective.id);
            if (idx > -1) {
                state.objectives[idx].statement = objective.statement;
            }

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                objective,
                data => { /* successfully updated */ },
                err => commit('DELETE_OBJECTIVE_FAILED', err)
            )
        },

        DELETE_OBJECTIVE({state, commit}, objectiveId) {
            // delete from local objectives list
            let idx = state.objectives.findIndex((x) => x.id === objectiveId);
            if (idx > -1) {
                state.objectives.splice(idx, 1);
            }

            // send request to delete the objective
            okrSvc.deleteObjective(
                user.state.selectedSubject.id,
                objectiveId,
                data => { /* successfully deleted */ },
                err => commit('DELETE_OBJECTIVE_FAILED', err)
            )
        }
    }
}
