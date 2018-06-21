import axios from 'axios/index';
import authSvc from './authservice';

class OkrService {
    constructor(tokenService, httpClientFactory) {
        this.tokenService = tokenService;
        this.httpClient = httpClientFactory.create({
            //baseURL: 'http://localhost:8001',
            baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.1.0',
            headers: {'Accept': 'application/json'}
        });
    }

    getSubjectObjectives(subjectId, dataHandler, errHandler) {
        const token = this.tokenService.getToken();
        this.httpClient
            //.headers('Authorization', `Bearer ${token}`)
            .get(`/${subjectId || 'me'}/objectives`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }
}

// Single instance pattern
export default new OkrService(authSvc, axios);
