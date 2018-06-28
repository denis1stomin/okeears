import axios from 'axios/index';

class OkrService {
    constructor(httpClientFactory) {
        this.httpClient = httpClientFactory.create({
            baseURL: 'http://localhost:8001',
            // baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.5.0',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        let subjPath = subjectId ? `/subjects/${subjectId}` : '/me';
        this.httpClient
            //.headers('Authorization', `Bearer ${token}`)
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

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        this.httpClient
            //.delete(`/subjects/${subjectId}/objectives/${objectiveId}`)
            .delete(`/objectives/${objectiveId}`)
            .then(resp => successHandler(resp))
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

// Single instance pattern
export default new OkrService(axios);
