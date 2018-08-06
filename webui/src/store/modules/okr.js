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

        EDIT_OBJECTIVE(state, payload) {
            let objectives = state.objectives;
            let obj = payload.objective;

            objectives[objectives.indexOf(obj)].statement = payload.statement;
            state.objectives = objectives;
        },

        EDIT_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        DELETE_OBJECTIVE(state, payload) {
            state.error = null;
            let objectives = state.objectives;

            objectives.splice(objectives.indexOf(payload), 1);
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
        },

        CREATE_KEYRESULT(state, payload) {
            let objectives = state.objectives;
            let objective = payload.objective;
            if(!objective.keyresults) {
                objective.keyresults = [];
            }

            objective.keyresults.push(payload.keyresult);
            objectives[objectives.indexOf(objective)].keyresults = objective.keyresults;
            state.objectives = objectives;
        },

        CREATE_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
        },

        EDIT_KEYRESULT(state, payload) {
            let objectives = state.objectives;
            let targetObjective = payload.objective;
            let objective = objectives.indexOf(targetObjective);
            let keyresult = targetObjective.keyresults.indexOf(payload.keyresult);

            objectives[objective].keyresults[keyresult].statement = payload.krStatement;
            state.objectives = objectives;
        },

        EDIT_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
        },

        DELETE_KEYRESULT(state, payload) {
            let objectives = state.objectives;
            let objective = payload.objective;
            let keyresults = objectives[objectives.indexOf(objective)].keyresults;

            keyresults.splice(keyresults.indexOf(payload.keyresult), 1);
        },

        DELETE_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
        },
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

        EDIT_OBJECTIVE({state, commit}, data) {
            // update in local objectives list
            commit('EDIT_OBJECTIVE', data);

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                data.objective,
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

        CREATE_KEYRESULT({state, commit}, data) {
            // update in local objectives list
            // TODO: update after a successful upload
            commit('CREATE_KEYRESULT', data);

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                data.objective,
                data => { /* successfully created */ },
                err => {commit('CREATE_KEYRESULT_FAILED', err)}
            );
        },

        EDIT_KEYRESULT({state, commit}, data) {
            // update in local objectives list
            // TODO: update after a successful upload
            commit('EDIT_KEYRESULT', data);

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                data.objective,
                data => { /* successfully created */ },
                err => {commit('EDIT_KEYRESULT_FAILED', err)}
            );
        },

        DELETE_KEYRESULT({state, commit}, data) {
            // update in local objectives list
            // TODO: update after a successful upload
            commit('DELETE_KEYRESULT', data);

            // send request to change the objective
            okrSvc.changeObjective(
                user.state.selectedSubject.id,
                data.objective,
                data => { /* successfully created */ },
                err => {commit('DELETE_KEYRESULT_FAILED', err)}
            );
        },
    }
}
