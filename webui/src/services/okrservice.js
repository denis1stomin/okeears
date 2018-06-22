import axios from 'axios/index';
import authSvc from './authservice';

class OkrService {
    constructor(tokenService, httpClientFactory) {
        this.tokenService = tokenService;
        this.httpClient = httpClientFactory.create({
            //baseURL: 'http://localhost:8001',
            baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.5.0',
            headers: {'Accept': 'application/json'}
        });
    }

    getObjectives(subjectId, dataHandler, errHandler) {
        //const token = this.tokenService.getToken();
        this.httpClient
            //.headers('Authorization', `Bearer ${token}`)
            .get(`/${subjectId || 'me'}/objectives`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    createObjective(subjectId, objectiveObj, dataHandler, errHandler) {
        this.httpClient
            .post(`/${subjectId}/objectives`, objectiveObj)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    deleteObjective(subjectId, objectiveId, successHandler, errHandler) {
        const token = this.tokenService.getToken();
        this.httpClient
            .delete(`/${subjectId}/objectives/${objectiveId}`)
            .then(resp => successHandler(resp))
            .catch(err => errHandler(err));
    }

    getObjectiveKeyResults(subjectId, objectiveId, dataHandler, errHandler) {
        this.httpClient
            .get(`/${subjectId}/objectives/${objectiveId}/keyresults`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    putObjectiveKeyResults(subjectId, objectiveId, keyResultsObj, dataHandler, errHandler) {
        this.httpClient
            .put(`/${subjectId}/objectives/${objectiveId}/keyresults`, keyResultsObj)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }
}

// Single instance pattern
export default new OkrService(authSvc, axios);
