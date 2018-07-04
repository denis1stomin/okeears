const MicrosoftGraph = require('@microsoft/microsoft-graph-client');

import DevSubjectService from './devsubjectservice';
let devSvc = new DevSubjectService(window.AppConfig, null);

export default class GraphSubjectService {
    constructor(config, tokenProvider) {
        this.graphClient = MicrosoftGraph.Client.init({
            authProvider: tokenProvider
        });
    }

    getCurrentUser(dataHandler, errHandler) {
        this.graphClient
            .api('/me')
            //.select("displayName")
            .get()
            .then((resp) => dataHandler(resp.body))
            .catch(errHandler);
    }

    getSubjectOrgTree(subjectId, dataHandler, errHandler) {
        devSvc.getSubjectOrgTree(subjectId, dataHandler, errHandler);
    }
}
