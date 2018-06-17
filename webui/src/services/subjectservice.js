import axios from 'axios/index';
import authSvc from './authservice';

class SubjectService {
    constructor(tokenService, httpClientFactory) {
        this.tokenService = tokenService;
        this.httpClient = httpClientFactory.create({
            baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.1.0',
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
            .then(resp => {
                let data = resp.data;
                data.push(Object.assign({}, data[0]));
                data.push(Object.assign({}, data[0]));
                data[1].id = '351393bd-ebae-4d7e-b755-26b148b700d6';
                data[1].name = 'Bob Marley';
                data[2].id = '7003753e-4337-499d-9daf-bca9756a274b';
                data[2].name = 'Dima Bilan';
                dataHandler(data);
            })
            .catch(err => errHandler(err));
    }
}

// Single instance pattern
export default new SubjectService(authSvc, axios);
