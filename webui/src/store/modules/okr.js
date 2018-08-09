import OkrService from './../../services/okrservice';
import user from './user'

let okrSvc = new OkrService();

export default {
    state: {
        objectives: [],
        loading: false,
        saving: false,
        error: null
    },

    mutations: {
        OBJECTIVES_COMPLETE(state, payload) {
            state.error = null;
            state.loading = false;
            state.saving = false;
            state.objectives = payload;
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload;
            state.loading = false;
            state.saving = false;
        },

        CREATE_OBJECTIVE(state, payload) {
            state.error = null;
            state.saving = true;
            state.objectives = payload;
        },

        CREATE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        EDIT_OBJECTIVE(state, payload) {
            state.saving = true;
           
            let objectives = state.objectives;
            let obj = payload.objective;

            objectives[objectives.indexOf(obj)].statement = payload.statement;
            state.objectives = objectives;
        },

        EDIT_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        DELETE_OBJECTIVE(state, objectiveId) {
            state.error = null;
            state.saving = true;

            let idx = state.objectives.findIndex((x) => x.id === objectiveId);
            if (idx > -1) {
                state.objectives.splice(idx, 1);
            }
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        CREATE_KEYRESULT(state, payload) {
            state.saving = true;
            let objectives = state.objectives;
            let objective = payload.objective;
            objective.keyresults.push(payload.keyresult);
            objectives[objectives.indexOf(objective)].keyresults = objective.keyresults;
            state.objectives = objectives;
        },

        CREATE_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        EDIT_KEYRESULT(state, payload) {
            state.saving = true;
            let objectives = state.objectives;
            let targetObjective = payload.objective;
            let objectiveIndex = objectives.indexOf(targetObjective);
            let keyresultIndex = targetObjective.keyresults.indexOf(payload.keyresult);

            objectives[objectiveIndex].keyresults[keyresultIndex].statement = payload.krStatement;
            objectives[objectiveIndex].keyresults[keyresultIndex].percent = payload.krPercent;
            state.objectives = objectives;
        },

        EDIT_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        DELETE_KEYRESULT(state, payload) {
            state.saving = true;
            let objectives = state.objectives;
            let objective = payload.objective;
            let keyresults = objectives[objectives.indexOf(objective)].keyresults;

            keyresults.splice(keyresults.indexOf(payload.keyresult), 1);
        },

        DELETE_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        SAVING_SUCCESSFULLY_COMPLETE(state) {
            state.error = null;
            state.saving = false;
        },

        SAVING_STARTED(state) {
            state.saving = true;
        },

        LOADING_STARTED(state) {
            state.loading = true;
        }
    },

    actions: {
        GET_OBJECTIVES({state, commit}) {
            commit('LOADING_STARTED');

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
            commit('SAVING_STARTED');

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
                        // TODO: Use mutations!
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

            commit('SAVING_STARTED');

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

                    commit('SAVING_SUCCESSFULLY_COMPLETE');
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
                data => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('EDIT_OBJECTIVE_FAILED', err)
            )
        },

        DELETE_OBJECTIVE({state, commit}, objectiveId) {
            // delete in local objectives list
            commit('DELETE_OBJECTIVE', objectiveId);

            // send request to delete the objective
            okrSvc.deleteObjective(
                user.state.selectedSubject.id,
                objectiveId,
                data => commit('SAVING_SUCCESSFULLY_COMPLETE'),
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
                data => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('CREATE_KEYRESULT_FAILED', err)
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
                data => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('EDIT_KEYRESULT_FAILED', err)
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
                data => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('DELETE_KEYRESULT_FAILED', err)
            );
        },
    }
}
