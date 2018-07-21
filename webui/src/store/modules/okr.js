import OkrService from './../../services/devokrservice';
import user from './user'

let okrSvc = new OkrService(window.AppConfig, null);

export default {
    state: {
        objectives: [],
        targetObjective: {},
        error: ''
    },

    mutations: {
        CHANGE_TARGET_OBJECTIVE(state, objective) {
            state.targetObjective = objective
        },

        OBJECTIVES_COMPLETE(state, payload) {
            state.objectives = payload;
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload;
        },

        CREATE_OBJECTIVE(state, payload) {
            state.objectives = payload;
        },

        CREATE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        EDIT_OBJECTIVE(state, objective) {
            // let idx = state.objectives.findIndex((x) => x.id === objective.id);
            // if (idx > -1) {
            //     state.objectives[idx].statement = objective.statement;
            // }
            let objectives = state.objectives;
            let obj = state.targetObjective;

            objectives[objectives.indexOf(obj)].statement = objective.statement;
            state.objectives = objectives;
        },

        EDIT_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        DELETE_OBJECTIVE(state, objective) {
            let objectives = state.objectives;
            objectives.splice(objectives.indexOf(objective), 1);
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        CREATE_KEYRESULT(state, keyresult) {
            let objectives = state.objectives;
            let objective = state.targetObjective;

            if(!objective.keyresults) {
                objective.keyresults = [];
            }

            objective.keyresults.push(keyresult);
            objectives[objectives.indexOf(objective)].keyresults = objective.keyresults;
            state.objectives = objectives;
        },

        CREATE_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
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

        EDIT_OBJECTIVE({state, commit}, objective) {
            // update in local objectives list
            commit('EDIT_OBJECTIVE', objective);

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                state.targetObjective,
                data => { /* successfully updated */ },
                err => commit('EDIT_OBJECTIVE_FAILED', err)
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
        },

        CREATE_KEYRESULT({state, commit}, keyresult) {
            // update in local objectives list
            // TODO: update after a successful upload
            commit('CREATE_KEYRESULT', keyresult);

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                state.targetObjective,
                data => { /* successfully created */ },
                err => {commit('CREATE_KEYRESULT_FAILED', err)}
            );
        }
    }
}
