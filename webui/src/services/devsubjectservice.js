import axios from 'axios/index';

export default class DevSubjectService {
    constructor(config, tokenProvider) {
        this.httpClient = axios.create({
            baseURL: config.baseURL,
            headers: {'Accept': 'application/json'}
        });
    }

    getCurrentUser(dataHandler, errHandler) {
        this.httpClient
            .get('/me')
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }

    getSubjectOrgTree(subjectId, dataHandler, errHandler) {
        this.httpClient
            .get(`/${subjectId || 'me'}/orgtree`)
            .then(resp => dataHandler(resp.data))
            .catch(err => errHandler(err));
    }
}
