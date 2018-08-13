import OkrService from './../../services/okrservice';
import user from './user'

let okrSvc = new OkrService();

const moveItem = (itemId, fromArr, toArr) => {
    const idx = fromArr.findIndex((x) => x.id === itemId);
    if (idx > -1) {
        const item = fromArr[idx];

        fromArr.splice(idx, 1);
        toArr.push(item);
    }
};

export default {
    state: {
        objectives: [],
        removedObjectives: [],
        landingObjective: {
            statement: "Create a few ambitious objectives",
            keyresults: [
                { 
                    statement: "Create 3 objectives for the next iteration",
                    percent: 0
                },
                {
                    statement: "Create 1-3 measurable key results for each objective",
                    percent: 0
                }
            ]
        },
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
            state.removedObjectives = [];
        },

        ADD_OBJECTIVE(state, payload) {
            state.error = null;
            state.objectives.unshift(payload);
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload;
            state.loading = false;
            state.saving = false;
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

            moveItem(objectiveId, state.objectives, state.removedObjectives);
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;
        },

        RESTORE_OBJECTIVE(state, objectiveId) {
            state.error = null;
            state.saving = true;

            moveItem(objectiveId, state.removedObjectives, state.objectives);
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

    getters: {
        HAVE_VISIBLE_OBJECTIVES(state) {
            return (state.objectives.length + state.removedObjectives.length) > 0;
        },

        VISIBLE_OBJECTIVES(state) {
            return state.objectives
                .concat(state.removedObjectives)
                .sort((a, b) => {
                    return a.createdDateTime < b.createdDateTime;
                });
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
            commit('ADD_OBJECTIVE', objective);
            commit('SAVING_STARTED');

            // send request to create new objective
            okrSvc.createObjective(
                user.state.selectedSubject.id,
                objective,
                createdObjective => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('CREATE_OBJECTIVE_FAILED', err)
            )
        },

        COPY_OBJECTIVE_TO_CURRENT_USER({state, commit}, objective) {
            // Need to update model only if copy own objective
            if (user.state.me.id === user.state.selectedSubject.id) {
                commit('ADD_OBJECTIVE', objective);
            }
            commit('SAVING_STARTED');

            // send request to create objective copy
            okrSvc.createObjective(
                user.state.me.id,
                objective,
                createdObjective => commit('SAVING_SUCCESSFULLY_COMPLETE'),
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

        RESTORE_OBJECTIVE({state, commit}, objectiveId) {
            // restore in local objectives list
            commit('RESTORE_OBJECTIVE', objectiveId);

            const objective = state.objectives.find((x) => x.id === objectiveId);

            // send request to create the objective
            okrSvc.createObjective(
                user.state.selectedSubject.id,
                objective,
                createdObjective => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('CREATE_OBJECTIVE_FAILED', err)
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
