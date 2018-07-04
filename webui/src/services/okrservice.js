import axios from 'axios/index';
import authSvc from './authservice';

class OkrService {
    constructor(tokenService, httpClientFactory) {
        this.tokenService = tokenService;
        this.httpClient = httpClientFactory.create({
            baseURL: 'http://d319b4af8ad541c48b45ff6c3872b0d3.westeurope.azurecontainer.io:8001',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        //const token = this.tokenService.getToken();
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
        const token = this.tokenService.getToken();
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
export default new OkrService(authSvc, axios);