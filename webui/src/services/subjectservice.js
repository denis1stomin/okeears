import axios from 'axios/index';
import authSvc from './authservice';

class SubjectService {
    constructor(tokenService, httpClientFactory) {
        this.tokenService = tokenService;
        this.httpClient = httpClientFactory.create({
            //baseURL: 'http://localhost:8001',
            baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.5.0',
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
