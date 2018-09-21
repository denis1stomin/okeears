import OkrService from './../../services/okrservice';
import TelemetryService from './../../services/telemetryservice';
import user from './user'

const okrSvc = new OkrService();
const telemetry = new TelemetryService();

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
        loading: false,
        saving: false,
        error: null,
        invalidOneDriveForBusinessLicense: false
    },

    mutations: {
        OBJECTIVES_COMPLETE(state, payload) {
            state.error = null;
            state.invalidOneDriveForBusinessLicense = false;
            state.loading = false;
            state.saving = false;
            state.objectives = payload;
            state.removedObjectives = [];
        },

        CLEAR_OBJECTIVES(state) {
            state.objectives = [];
            state.removedObjectives = [];
            state.loading = false;
            state.saving = false;
        },

        ADD_OBJECTIVE(state, payload) {
            state.error = null;
            state.objectives.unshift(payload);
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload;
            state.invalidOneDriveForBusinessLicense = false;
            state.loading = false;
            state.saving = false;

            telemetry.trackEvent("error", {
                method: "OBJECTIVES_FAILED"
            });
        },

        MARK_ONEDRIVE_LICENSE_ERROR(state) {
            state.invalidOneDriveForBusinessLicense = true;

            telemetry.trackEvent("error", {
                method: "MARK_ONEDRIVE_LICENSE_ERROR"
            });
        },

        CREATE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;

            telemetry.trackEvent("error", {
                method: "CREATE_OBJECTIVE_FAILED"
            });
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

            telemetry.trackEvent("error", {
                method: "EDIT_OBJECTIVE_FAILED"
            });
        },

        DELETE_OBJECTIVE(state, objectiveId) {
            state.error = null;
            state.saving = true;

            moveItem(objectiveId, state.objectives, state.removedObjectives);
        },

        DELETE_OBJECTIVE_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;

            telemetry.trackEvent("error", {
                method: "DELETE_OBJECTIVE_FAILED"
            });
        },

        RESTORE_OBJECTIVE(state, objectiveId) {
            state.error = null;
            state.saving = true;

            moveItem(objectiveId, state.removedObjectives, state.objectives);
        },

        PURGE_OBJECTIVE(state, objectiveId) {
            moveItem(objectiveId, state.removedObjectives, []);
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

            telemetry.trackEvent("error", {
                method: "CREATE_KEYRESULT_FAILED"
            });
        },

        EDIT_KEYRESULT(state, payload) {
            state.saving = true;
            let objectives = state.objectives;
            let targetObjective = payload.objective;
            let objectiveIndex = objectives.indexOf(targetObjective);
            let keyresultIndex = targetObjective.keyresults.indexOf(payload.keyresult);

            objectives[objectiveIndex].keyresults[keyresultIndex].statement = payload.krStatement;
            objectives[objectiveIndex].keyresults[keyresultIndex].percent = payload.krPercent;
            objectives[objectiveIndex].keyresults[keyresultIndex].description = payload.krDescription;
            state.objectives = objectives;
        },

        EDIT_KEYRESULT_FAILED(state, payload) {
            state.error = payload;
            state.saving = false;

            telemetry.trackEvent("error", {
                method: "EDIT_KEYRESULT_FAILED"
            });
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

            telemetry.trackEvent("error", {
                method: "DELETE_KEYRESULT_FAILED"
            });
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
                err => {
                    if (err.statusCode == 404 && err.code == 30108) {
                        // The OneDriveForBusiness for this user account cannot be retrieved
                        commit('MARK_ONEDRIVE_LICENSE_ERROR');
                        // No objectives available for such users
                        commit('CLEAR_OBJECTIVES');
                    } else {
                        commit('OBJECTIVES_FAILED', err);
                    }
                }
            );
        },

        CREATE_OBJECTIVE({state, commit}, objective) {
            // We need to set unique objective id before committing mutation,
            // otherwise Vue's list rendering engine (v-for statement) will reuse DOM elements
            // and display several items with the same text for newly added objectives.
            objective.id = 'temp-' + okrSvc.createId();
            objective.lastModifiedDateTime = new Date();
            objective.onenoteWebUrl = null;

            commit('ADD_OBJECTIVE', objective);
            commit('SAVING_STARTED');

            // send request to create new objective
            okrSvc.createObjective(
                user.state.selectedSubject.id,
                objective,
                createdObjective => commit('SAVING_SUCCESSFULLY_COMPLETE'),
                err => commit('CREATE_OBJECTIVE_FAILED', err)
            )

            telemetry.trackEvent("CreateObjective", {
                statementLength: objective.statement.length
            });
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

            telemetry.trackEvent("CopyObjective", {
                sourceSubjectId: user.state.selectedSubject.id,
                statementLength: objective.statement.length
            });
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

            telemetry.trackEvent("EditObjective", {
                statementLength: data.objective.statement.length
            });
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

            telemetry.trackEvent("DeleteObjective");
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
            telemetry.trackEvent("RestoreObjective", {
                objectiveId: objectiveId,
                statementLength: objective.statement.length
            });
        },

        PURGE_OBJECTIVE({commit}, objectiveId) {
            commit('PURGE_OBJECTIVE', objectiveId);
            telemetry.trackEvent("PurgeObjective", {
                objectiveId: objectiveId
            });
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

            telemetry.trackEvent("CreateKeyResult", {
                objectiveId: data.objective.id,
                statementLength: data.objective.statement.length,
                krStatementLength: data.keyresult.statement.length
            });
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

            telemetry.trackEvent("EditKeyResult", {
                objectiveId: data.objective.id,
                statementLength: data.objective.statement.length,
                krStatementLength: krStatement.length,
                krDescriptionLength: krDescription.length
            });
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

            telemetry.trackEvent("DeleteKeyResult", {
                objectiveId: data.objective.id,
                statementLength: data.objective.statement.length,
                krStatementLength: data.keyresult.statement.length,
                krDescriptionLength: data.keyresult.description.length
            });
        },
    }
}
