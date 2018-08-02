import axios from 'axios/index';

export default class DevOkrService {
    constructor(config, tokenProvider) {
        this.httpClient = axios.create({
            baseURL: config.services.uris.okrservice || config.services.uris.general || undefined,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        let subjPath = subjectId ? `/subjects/${subjectId}` : '/me';
        this.httpClient
            .get(`${subjPath}/objectives`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    createObjective(subjectId, objective, dataHandler, errHandler) {
        this.httpClient
            .post(`/subjects/${subjectId}/objectives`, objective)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    changeObjective(subjectId, objective, dataHandler, errHandler) {
        objective.subjectId = subjectId;    // temp
        this.httpClient
            //.put(`/subjects/${subjectId}/objectives/${objective.id}`, objective)
            .put(`/objectives/${objective.id}`, objective)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    deleteObjective(subjectId, objectiveId, dataHandler, errHandler) {
        this.httpClient
            //.delete(`/subjects/${subjectId}/objectives/${objectiveId}`)
            .delete(`/objectives/${objectiveId}`)
            .then(resp => dataHandler(resp))
            .catch(err => errHandler(err));
    }

    getObjectiveKeyResults(subjectId, objectiveId, dataHandler, errHandler) {
        this.httpClient
            .get(`/subjects/${subjectId}/objectives/${objectiveId}/keyresults`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    putObjectiveKeyResults(subjectId, objectiveId, keyResultsObj, dataHandler, errHandler) {
        this.httpClient
            .put(`/subjects/${subjectId}/objectives/${objectiveId}/keyresults`, keyResultsObj)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }
}
