import axios from 'axios/index';
import authSvc from './authservice';

class SubjectService {
    constructor(tokenService, httpClientFactory) {
        this.tokenService = tokenService;
        this.httpClient = httpClientFactory.create({
            baseURL: 'http://d319b4af8ad541c48b45ff6c3872b0d3.westeurope.azurecontainer.io:8001',
            headers: {'Accept': 'application/json'}
        });
    }

    getCurrentUser(dataHandler, errHandler) {
        const token = this.tokenService.getToken();
        this.httpClient
            //.headers('Authorization', `Bearer ${token}`)
            .get('/me')
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    getSubjectOrgTree(subjectId, dataHandler, errHandler) {
        const token = this.tokenService.getToken();
        this.httpClient
            //.headers('Authorization', `Bearer ${token}`)
            .get(`/${subjectId || 'me'}/orgtree`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }
}

// Single instance pattern
export default new SubjectService(authSvc, axios);
